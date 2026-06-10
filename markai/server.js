const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { GoogleGenAI, Type, Modality } = require("@google/genai");

const fs = require("fs");
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads

// Centralized error handler for API key
const checkApiKey = (req, res, next) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("❌ API Key not found in environment variables.");
    return res.status(500).json({ 
      error: "Server configuration error: API key is missing. Please set the API_KEY environment variable." 
    });
  }
  // Attach AI instance to request for later use
  req.ai = new GoogleGenAI({ apiKey });
  next();
};

// ==========================================
// Google OAuth Endpoints
// ==========================================

const getRedirectUri = (req) => {
  // Use the referer or a provided header to figure out the base callback URL
  // We'll rely on the client passing an explicit "origin" or use standard headers
  // For AI Studio, it's safer if the client passes its origin
  return `${req.query.origin || 'http://localhost:3000'}/auth/google/callback`;
};

app.get('/api/auth/google/url', (req, res) => {
  const redirectUri = getRedirectUri(req);
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "Missing GOOGLE_CLIENT_ID environment variable" });
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline', // optional
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ url: authUrl });
});

app.post('/api/auth/google/exchange', async (req, res) => {
  const { code, origin } = req.body;
  if (!code || !origin) {
    return res.status(400).json({ error: "Missing code or origin" });
  }

  const redirectUri = `${origin}/auth/google/callback`;

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      })
    });

    const tokens = await tokenResponse.json();
    if (tokens.error) {
       return res.status(400).json(tokens);
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const userInfo = await userResponse.json();
    
    // In a real database, we would sync this user
    res.json({
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        tier: 'free'
      }
    });
  } catch (err) {
    console.error("OAuth exchange error:", err);
    res.status(500).json({ error: "Failed to exchange code" });
  }
});

// Since the popup callback is a GET request sent FROM Google back to the browser 
// we will intercept it in the frontend router or in an express route. 
// As per the skill doc, returning an HTML snippet to close the popup is ideal.
app.get(['/auth/google/callback', '/auth/google/callback/'], (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.send(`
      <html><body><script>
        if(window.opener) { window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*'); window.close(); }
      </script>Authentication failed.</body></html>
    `);
  }

  // Send success message (passing the code) to parent window
  res.send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code: '${code}' }, '*');
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
        <p>Authentication successful. This window should close automatically.</p>
      </body>
    </html>
  `);
});

app.post("/api/sendNotification", async (req, res) => {
  console.log("📨 Received request to /api/sendNotification");
  const EXTERNAL_URL = 'https://portal.aucdt.edu.gh/aucdt-dev/sendMail';
  try {
    const response = await fetch(EXTERNAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      console.warn(`⚠️ External notification endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.warn("⚠️ Could not reach external notification endpoint (might be offline):", error.message);
  }
  
  // We always return 200 to the client so it doesn't fail the UI flow
  res.status(200).json({ success: true, message: "Notification processed" });
});

// Apply middleware to specific routes only
app.post("/api/generate", checkApiKey, async (req, res) => {
  console.log("📨 Received request to /api/generate");
  const { prompt, brandVoice, platforms, model, emailVariantCount } = req.body;
  
  if (!prompt || !brandVoice || !platforms || !platforms.length || !model) {
    return res.status(400).json({ error: "Missing required fields: prompt, brandVoice, platforms, and model are required." });
  }

  try {
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, description: "The social media platform for this content. Must be one of the requested platforms." },
          content: { type: Type.STRING, description: "The marketing copy for the post, tailored to the platform." },
          imagePrompt: { type: Type.STRING, description: "A descriptive prompt for an AI image generator to create a visually appealing and relevant image for this post." },
          variants: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "For 'Email' platform only, an array of alternative subject lines. For other platforms, this should be an empty array.",
          },
        },
        required: ["platform", "content", "imagePrompt", "variants"],
      },
    };
    
    const fullPrompt = `
      You are an expert marketing copywriter. Your task is to generate marketing content for a product or announcement.
      Product/Announcement Details: ${prompt}
      Platforms to generate content for: ${platforms.join(', ')}
      Instructions:
      1. For each platform, create a post that is tailored to its specific audience and format.
      2. For each post, also create a detailed, visually descriptive prompt that an AI image generator could use to create a compelling image to accompany the text.
      3. For the "Email" platform, generate exactly ${emailVariantCount || 3} alternative subject lines for A/B testing. For all other platforms, the "variants" array must be empty.
      4. Return the output as a JSON array that matches the provided schema. Ensure the 'platform' field for each object exactly matches one of the requested platforms. Do not add any extra text or markdown formatting around the JSON output.
    `;

    const actualModelName = model === 'pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    console.log(`🤖 Using model: ${actualModelName} (requested: ${model})`);

    const response = await req.ai.models.generateContent({
      model: actualModelName,
      contents: fullPrompt,
      config: {
        systemInstruction: brandVoice,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const generatedContent = JSON.parse(response.text);
    console.log("✅ Successfully got structured response from Gemini API");
    res.json(generatedContent);

  } catch (error) {
    console.error("❌ Error calling Gemini API for content generation:", error);
    res.status(500).json({ error: "Something went wrong while generating content.", details: error.message });
  }
});

app.post("/api/edit-image", checkApiKey, async (req, res) => {
  console.log("📨 Received request to /api/edit-image");
  const { base64ImageData, mimeType, prompt } = req.body;

  if (!base64ImageData || !mimeType || !prompt) {
    return res.status(400).json({ error: "Missing required fields: base64ImageData, mimeType, or prompt." });
  }

  try {
    const modelName = "gemini-2.5-flash-image";
    console.log(`🖼️ Using model: ${modelName} for image editing`);

    const response = await req.ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        console.log("✅ Successfully edited image with Gemini API");
        return res.json({ imageUrl });
      }
    }
    
    throw new Error("No image data found in Gemini API response.");

  } catch (error) {
    console.error("❌ Error calling Gemini API for image editing:", error);
    res.status(500).json({ error: "Something went wrong while editing the image.", details: error.message });
  }
});

app.post("/api/generate-image", checkApiKey, async (req, res) => {
  console.log("📨 Received request to /api/generate-image");
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing required field: prompt." });
  }

  try {
    const modelName = 'imagen-4.0-generate-001'; // Upgraded model for higher quality
    const outputMimeType = 'image/jpeg';
    console.log(`🎨 Using high-quality model: ${modelName} for image generation`);

    const response = await req.ai.models.generateImages({
      model: modelName,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: outputMimeType,
        aspectRatio: '16:9', // Better for social media posts
      },
    });
    
    const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;

    if (base64ImageBytes) {
      const imageUrl = `data:${outputMimeType};base64,${base64ImageBytes}`;
      console.log("✅ Successfully generated high-quality image with Imagen API");
      return res.json({ imageUrl });
    }
    
    throw new Error("No image data found in Imagen API response.");

  } catch (error) {
    console.error("❌ Error calling Imagen API for image generation:", error);
    res.status(500).json({ error: "Something went wrong while generating the image.", details: error.message });
  }
});

// Serve frontend static files
const path = require("path");
app.use(express.static(path.join(__dirname, "dist")));

// Serve static callback file directly for Google OAuth redirect URI
app.get(["/callback", "/callback/"], (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "callback", "index.html"));
});

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Server running securely on http://localhost:${port}`);
  console.log(`📡 Marketing content: POST http://localhost:${port}/api/generate`);
  console.log(`🖼️  Image editing: POST http://localhost:${port}/api/edit-image`);
  console.log(`🎨 Image generation: POST http://localhost:${port}/api/generate-image`);
});