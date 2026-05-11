package com.lems.service;

import com.lems.model.AuditLog;
import com.lems.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfExtractionService {
    private final AuditLogRepository auditLogRepository;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    public Map<String, Object> extractAndProcessPdf(MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Extract text from PDF
            String pdfText = extractTextFromPdf(file);
            log.info("Successfully extracted text from PDF: {} bytes", pdfText.length());

            // Log the event
            AuditLog log = new AuditLog();
            log.setEventType("PDF_EXTRACTION");
            log.setDescription("PDF file processed: " + file.getOriginalFilename());
            log.setStatus("SUCCESS");
            log.setDetails("Extracted " + pdfText.length() + " characters from PDF");
            auditLogRepository.save(log);

            result.put("success", true);
            result.put("message", "PDF processed successfully");
            result.put("extractedText", pdfText);
            result.put("fileName", file.getOriginalFilename());

        } catch (IOException e) {
            log.error("Error processing PDF: {}", e.getMessage());
            
            AuditLog log = new AuditLog();
            log.setEventType("PDF_EXTRACTION");
            log.setDescription("PDF processing failed: " + file.getOriginalFilename());
            log.setStatus("FAILURE");
            log.setDetails("Error: " + e.getMessage());
            auditLogRepository.save(log);

            result.put("success", false);
            result.put("message", "Failed to process PDF");
            result.put("error", e.getMessage());
        }

        return result;
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public Map<String, Object> parseGeminiResponse(String geminiResponse) {
        // This is a placeholder for parsing Gemini API response
        // In a real implementation, this would parse the structured curriculum data
        Map<String, Object> parsed = new HashMap<>();
        parsed.put("programmes", new Object[]{});
        parsed.put("courses", new Object[]{});
        parsed.put("lecturers", new Object[]{});
        return parsed;
    }
}

