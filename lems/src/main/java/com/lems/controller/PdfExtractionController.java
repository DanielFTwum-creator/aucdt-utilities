package com.lems.controller;

import com.lems.model.dto.ApiResponse;
import com.lems.service.PdfExtractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/pdf")
@RequiredArgsConstructor
public class PdfExtractionController {
    private final PdfExtractionService pdfExtractionService;

    @PostMapping("/extract")
    public ResponseEntity<ApiResponse<Map<String, Object>>> extractPdf(
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Empty file", "Please upload a valid PDF file"));
        }

        if (!file.getContentType().equals("application/pdf")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid file type", "Please upload a PDF file"));
        }

        try {
            Map<String, Object> result = pdfExtractionService.extractAndProcessPdf(file);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(ApiResponse.success(result, "PDF extracted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.error((String) result.get("error"), (String) result.get("message")));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage(), "Failed to process PDF"));
        }
    }

    @PostMapping("/process-curriculum")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processCurriculum(
            @RequestBody Map<String, String> request) {
        
        String extractedText = request.get("extractedText");
        
        // This would call Google Gemini API in production
        // For now, return a mock response
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("success", true);
        result.put("message", "Curriculum data processed");
        result.put("programmes", new Object[]{});
        result.put("courses", new Object[]{});
        
        return ResponseEntity.ok(ApiResponse.success(result, "Curriculum processed successfully"));
    }
}

