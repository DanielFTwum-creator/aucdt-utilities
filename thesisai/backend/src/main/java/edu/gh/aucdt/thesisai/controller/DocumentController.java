package edu.gh.aucdt.thesisai.controller;

import edu.gh.aucdt.thesisai.model.Document;
import edu.gh.aucdt.thesisai.model.User;
import edu.gh.aucdt.thesisai.service.AnalysisService;
import edu.gh.aucdt.thesisai.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final AnalysisService analysisService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "type", required = false) String type,
            @AuthenticationPrincipal User user) {
        try {
            Document.DocumentType documentType = type != null ? 
                    Document.DocumentType.valueOf(type) : Document.DocumentType.PROPOSAL;
            
            Document document = documentService.uploadDocument(file, user, title, documentType);
            return ResponseEntity.ok(Map.of(
                    "message", "Document uploaded successfully",
                    "documentId", document.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Upload failed: " + e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Document>> getUserDocuments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(documentService.getUserDocuments(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzeDocument(@PathVariable Long id) {
        try {
            analysisService.analyzeDocument(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Analysis started",
                    "documentId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Analysis failed: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
    }
}
