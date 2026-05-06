import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import ExcelJS from "exceljs";
import sharp from "sharp";

const app = express();
const PORT = process.env.PORT ?? 3001;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";
const STATIC_PATH = process.env.STATIC_PATH ?? "";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY is not set. Checkout will fail.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// ── Inventory Excel export ────────────────────────────────────────────────────
interface PieceExport {
  sku: string;
  title: string;
  category: string;
  technique: string;
  status: string;
  price: number | null;
  description: string;
  image: string; // relative path e.g. /media/pots-by-kr/IMG_1058.webp
}

app.post("/api/export-inventory", async (req: Request, res: Response) => {
  const pieces: PieceExport[] = req.body?.pieces;
  if (!Array.isArray(pieces) || pieces.length === 0) {
    res.status(400).json({ error: "No pieces provided" });
    return;
  }

  const MEDIA_DIR = path.resolve(__dirname, "../../public/media/pots-by-kr");
  const THUMB_H = 68;
  const ROW_H = 72; // points (≈ px in Excel)

  const wb = new ExcelJS.Workbook();
  wb.creator = "KRPots Admin";
  const ws = wb.addWorksheet("KRPots Inventory");

  // Column definitions
  ws.columns = [
    { header: "Photo",       key: "photo",     width: 14 },
    { header: "SKU",         key: "sku",        width: 14 },
    { header: "Title",       key: "title",      width: 28 },
    { header: "Category",    key: "category",   width: 22 },
    { header: "Technique",   key: "technique",  width: 16 },
    { header: "Status",      key: "status",     width: 14 },
    { header: "Price (USD)", key: "price",      width: 13 },
    { header: "Description", key: "description",width: 52 },
  ];

  // Style header row
  const headerRow = ws.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
    cell.font = { bold: true, color: { argb: "FFC9A84C" }, size: 11 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFC9A84C" } },
    };
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];

  // Data rows
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const rowNum = i + 2;
    const row = ws.getRow(rowNum);
    row.height = ROW_H;

    const isForSale = p.status === "For Sale";
    const bgColor = isForSale ? "FFF5F0E8" : "FFFAF8F2";

    row.getCell("sku").value        = p.sku;
    row.getCell("title").value      = p.title;
    row.getCell("category").value   = p.category;
    row.getCell("technique").value  = p.technique;
    row.getCell("status").value     = p.status;
    row.getCell("price").value      = p.price ?? "N/A";
    row.getCell("description").value = p.description;

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.alignment = { wrapText: true, vertical: "middle" };
      cell.border = { bottom: { style: "hair", color: { argb: "FFDDDDDD" } } };
    });

    if (p.price !== null) {
      row.getCell("price").numFmt = '"$"#,##0.00';
    }

    // Embed thumbnail image
    const imgId = path.basename(p.image, path.extname(p.image)); // e.g. IMG_1058
    const webpPath = path.join(MEDIA_DIR, `${imgId}.webp`);
    if (fs.existsSync(webpPath)) {
      try {
        const meta = await sharp(webpPath).metadata();
        const origH = meta.height ?? THUMB_H;
        const origW = meta.width ?? THUMB_H;
        const scale = THUMB_H / origH;
        const thumbW = Math.max(1, Math.round(origW * scale));

        const pngBuf = await sharp(webpPath)
          .resize(thumbW, THUMB_H)
          .png()
          .toBuffer();

        const imgId2 = wb.addImage({ buffer: pngBuf, extension: "png" });
        ws.addImage(imgId2, {
          tl: { col: 0, row: rowNum - 1 } as ExcelJS.Anchor,
          br: { col: 1, row: rowNum } as ExcelJS.Anchor,
          editAs: "oneCell",
        });
      } catch {
        row.getCell("photo").value = "err";
      }
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const filename = `krpots-inventory-${date}.xlsx`;
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
});

// ── Checkout session ──────────────────────────────────────────────────────────
interface CartPiece {
  id: string;
  title: string;
  price: number;
}

interface CartItem {
  piece: CartPiece;
  quantity: number;
}

interface CheckoutBody {
  items: CartItem[];
}

app.post("/api/checkout/session", async (req: Request, res: Response) => {
  const body = req.body as CheckoutBody;

  if (!Array.isArray(body?.items) || body.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items.map(
      (item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.piece.title,
          },
          unit_amount: item.piece.price,
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Stripe error:", message);
    res.status(500).json({ error: message });
  }
});

// ── Static SPA serving (production) ───────────────────────────────────────────
if (STATIC_PATH) {
  const staticDir = path.resolve(STATIC_PATH);
  app.use(express.static(staticDir));

  // SPA fallback — serve index.html for all non-API routes
  app.get("*", (req: Request, res: Response) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const indexPath = path.join(staticDir, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`krpots backend listening on port ${PORT}`);
});
