package edu.gh.aucdt.thesisai.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import edu.gh.aucdt.thesisai.model.Document;
import edu.gh.aucdt.thesisai.model.User;
import edu.gh.aucdt.thesisai.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Value("${thesisai.upload.directory}")
    private String uploadDirectory;

    public Document uploadDocument(MultipartFile file, User user, String title, Document.DocumentType type) throws IOException {
        // Validate file
        validateFile(file);
        
        // Save file to disk
        String filename = generateFilename(file.getOriginalFilename());
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        
        // Determine file type
        Document.FileType fileType = determineFileType(file.getOriginalFilename());
        
        // Extract metadata
        String text = extractTextFromFile(filePath.toString(), fileType);
        int wordCount = countWords(text);
        
        // Create document record
        Document document = Document.builder()
                .user(user)
                .title(title != null ? title : file.getOriginalFilename())
                .filename(filename)
                .filePath(filePath.toString())
                .fileType(fileType)
                .fileSize(file.getSize())
                .wordCount(wordCount)
                .documentType(type != null ? type : Document.DocumentType.PROPOSAL)
                .status(Document.DocumentStatus.UPLOADED)
                .build();
        
        return documentRepository.save(document);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        // Add more validation as needed
    }

    private String generateFilename(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }

    private Document.FileType determineFileType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();
        return Document.FileType.valueOf(extension);
    }

    public String extractText(Document document) {
        return extractTextFromFile(document.getFilePath(), document.getFileType());
    }

    private String extractTextFromFile(String filePath, Document.FileType fileType) {
        try {
            return switch (fileType) {
                case PDF -> extractTextFromPDF(filePath);
                case DOCX -> extractTextFromDOCX(filePath);
                case TXT, MD -> new String(Files.readAllBytes(Paths.get(filePath)));
            };
        } catch (Exception e) {
            log.error("Error extracting text from file: {}", filePath, e);
            throw new RuntimeException("Failed to extract text from document", e);
        }
    }

    private String extractTextFromPDF(String filePath) throws IOException {
        try (InputStream input = Files.newInputStream(Paths.get(filePath));
             PDDocument document = PDDocument.load(input)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDOCX(String filePath) throws IOException {
        try (FileInputStream fis = new FileInputStream(filePath);
             XWPFDocument document = new XWPFDocument(fis)) {
            StringBuilder text = new StringBuilder();
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                text.append(paragraph.getText()).append("\n");
            }
            return text.toString();
        }
    }

    private int countWords(String text) {
        if (text == null || text.isEmpty()) return 0;
        return text.split("\\s+").length;
    }

    public List<Document> getUserDocuments(User user) {
        return documentRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public void save(Document document) {
        documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        Document document = getDocumentById(id);
        try {
            Files.deleteIfExists(Paths.get(document.getFilePath()));
        } catch (IOException e) {
            log.error("Error deleting file: {}", document.getFilePath(), e);
        }
        documentRepository.delete(document);
    }
}
