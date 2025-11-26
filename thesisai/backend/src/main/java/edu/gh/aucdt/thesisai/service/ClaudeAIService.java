package edu.gh.aucdt.thesisai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for interacting with Claude AI API for thesis analysis
 */
@Service
@Slf4j
public class ClaudeAIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${thesisai.claude.api.key}")
    private String apiKey;

    @Value("${thesisai.claude.model}")
    private String model;

    @Value("${thesisai.claude.max-tokens}")
    private int maxTokens;

    @Value("${thesisai.claude.timeout}")
    private int timeout;

    public ClaudeAIService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper,
                           @Value("${thesisai.claude.api.url}") String apiUrl) {
        this.webClient = webClientBuilder
                .baseUrl(apiUrl)
                .defaultHeader("anthropic-version", "2023-06-01")
                .build();
        this.objectMapper = objectMapper;
    }

    /**
     * Analyze thesis document using Claude AI
     */
    public AnalysisResult analyzeThesis(String documentText, String documentType) {
        try {
            String prompt = buildAnalysisPrompt(documentText, documentType);
            String response = callClaudeAPI(prompt);
            return parseAnalysisResponse(response);
        } catch (Exception e) {
            log.error("Error analyzing thesis with Claude AI", e);
            throw new RuntimeException("AI analysis failed: " + e.getMessage(), e);
        }
    }

    /**
     * Build comprehensive analysis prompt for Claude
     */
    private String buildAnalysisPrompt(String documentText, String documentType) {
        return String.format("""
                You are an expert thesis examiner and academic assessor. Analyze the following %s document comprehensively.
                
                Please evaluate the document across these dimensions:
                
                1. STRUCTURE ANALYSIS (Score 0-100):
                   - Overall organization and logical flow
                   - Chapter/section arrangement
                   - Coherence between sections
                   - Clarity of progression
                
                2. ARGUMENTATION ANALYSIS (Score 0-100):
                   - Clarity of thesis statement/research question
                   - Strength of arguments and evidence
                   - Logical reasoning
                   - Critical analysis depth
                
                3. METHODOLOGY ANALYSIS (Score 0-100):
                   - Research design appropriateness
                   - Methodological rigor
                   - Justification of methods
                   - Limitations acknowledgment
                
                4. WRITING QUALITY (Score 0-100):
                   - Academic tone and style
                   - Clarity and precision
                   - Grammar and mechanics
                   - Citation practices
                
                5. EXAMINABILITY SCORE (Score 0-100):
                   - Overall readiness for examination
                   - Potential for successful defense
                   - Contribution to field
                
                Provide your response in the following JSON format:
                {
                  "scores": {
                    "structure": <number>,
                    "argumentation": <number>,
                    "methodology": <number>,
                    "writingQuality": <number>,
                    "examinability": <number>,
                    "overall": <number>
                  },
                  "feedback": [
                    {
                      "section": "<section name>",
                      "type": "STRENGTH|WEAKNESS|SUGGESTION|QUESTION",
                      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
                      "title": "<brief title>",
                      "content": "<detailed feedback>",
                      "pageReference": "<page or section reference>"
                    }
                  ],
                  "vivaQuestions": [
                    {
                      "question": "<question text>",
                      "category": "<category>",
                      "difficulty": "EASY|MEDIUM|HARD",
                      "preparation": "<suggested preparation strategy>"
                    }
                  ],
                  "summary": "<overall assessment summary>"
                }
                
                Document to analyze:
                %s
                """, documentType, documentText);
    }

    /**
     * Call Claude API with the prompt
     */
    private String callClaudeAPI(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("max_tokens", maxTokens);
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));

        try {
            String response = webClient.post()
                    .header("x-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(timeout))
                    .block();

            // Extract content from Claude's response
            JsonNode jsonResponse = objectMapper.readTree(response);
            return jsonResponse.get("content").get(0).get("text").asText();
        } catch (Exception e) {
            log.error("Error calling Claude API", e);
            throw new RuntimeException("Failed to get AI response: " + e.getMessage(), e);
        }
    }

    /**
     * Parse Claude's JSON response into structured result
     */
    private AnalysisResult parseAnalysisResponse(String response) {
        try {
            // Extract JSON from response (Claude might wrap it in markdown)
            String jsonContent = response;
            if (response.contains("```json")) {
                int start = response.indexOf("```json") + 7;
                int end = response.lastIndexOf("```");
                jsonContent = response.substring(start, end).trim();
            }

            JsonNode json = objectMapper.readTree(jsonContent);
            
            AnalysisResult result = new AnalysisResult();
            
            // Parse scores
            JsonNode scores = json.get("scores");
            result.setStructureScore(scores.get("structure").asDouble());
            result.setArgumentationScore(scores.get("argumentation").asDouble());
            result.setMethodologyScore(scores.get("methodology").asDouble());
            result.setWritingQualityScore(scores.get("writingQuality").asDouble());
            result.setExaminabilityScore(scores.get("examinability").asDouble());
            result.setOverallScore(scores.get("overall").asDouble());
            
            // Parse feedback items
            JsonNode feedback = json.get("feedback");
            if (feedback != null && feedback.isArray()) {
                result.setFeedbackItems(objectMapper.convertValue(
                        feedback, objectMapper.getTypeFactory().constructCollectionType(List.class, FeedbackItem.class)
                ));
            }
            
            // Parse viva questions
            JsonNode questions = json.get("vivaQuestions");
            if (questions != null && questions.isArray()) {
                result.setVivaQuestions(objectMapper.convertValue(
                        questions, objectMapper.getTypeFactory().constructCollectionType(List.class, VivaQuestion.class)
                ));
            }
            
            result.setSummary(json.has("summary") ? json.get("summary").asText() : "");
            
            return result;
        } catch (Exception e) {
            log.error("Error parsing Claude API response", e);
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    // Result DTOs
    @lombok.Data
    public static class AnalysisResult {
        private Double structureScore;
        private Double argumentationScore;
        private Double methodologyScore;
        private Double writingQualityScore;
        private Double examinabilityScore;
        private Double overallScore;
        private List<FeedbackItem> feedbackItems;
        private List<VivaQuestion> vivaQuestions;
        private String summary;
    }

    @lombok.Data
    public static class FeedbackItem {
        private String section;
        private String type;
        private String severity;
        private String title;
        private String content;
        private String pageReference;
    }

    @lombok.Data
    public static class VivaQuestion {
        private String question;
        private String category;
        private String difficulty;
        private String preparation;
    }
}
