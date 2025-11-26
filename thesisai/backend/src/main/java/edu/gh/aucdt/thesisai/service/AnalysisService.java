package edu.gh.aucdt.thesisai.service;

import edu.gh.aucdt.thesisai.model.*;
import edu.gh.aucdt.thesisai.repository.AnalysisRepository;
import edu.gh.aucdt.thesisai.repository.FeedbackReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final FeedbackReportRepository feedbackReportRepository;
    private final ClaudeAIService claudeAIService;
    private final DocumentService documentService;

    @Async
    @Transactional
    public void analyzeDocument(Long documentId) {
        log.info("Starting analysis for document ID: {}", documentId);
        
        Document document = documentService.getDocumentById(documentId);
        Analysis analysis = createPendingAnalysis(document);
        
        try {
            // Update status
            analysis.setStatus(Analysis.AnalysisStatus.IN_PROGRESS);
            analysisRepository.save(analysis);
            
            // Extract document text
            String documentText = documentService.extractText(document);
            
            // Perform AI analysis
            long startTime = System.currentTimeMillis();
            ClaudeAIService.AnalysisResult result = claudeAIService.analyzeThesis(
                    documentText, 
                    document.getDocumentType().name()
            );
            long processingTime = (System.currentTimeMillis() - startTime) / 1000;
            
            // Save scores
            analysis.setStructureScore(BigDecimal.valueOf(result.getStructureScore()));
            analysis.setArgumentationScore(BigDecimal.valueOf(result.getArgumentationScore()));
            analysis.setMethodologyScore(BigDecimal.valueOf(result.getMethodologyScore()));
            analysis.setWritingQualityScore(BigDecimal.valueOf(result.getWritingQualityScore()));
            analysis.setExaminabilityScore(BigDecimal.valueOf(result.getExaminabilityScore()));
            analysis.setOverallScore(BigDecimal.valueOf(result.getOverallScore()));
            analysis.setProcessingTime((int) processingTime);
            analysis.setStatus(Analysis.AnalysisStatus.COMPLETED);
            analysis.setCompletedAt(LocalDateTime.now());
            analysisRepository.save(analysis);
            
            // Save feedback items
            saveFeedbackItems(analysis, result.getFeedbackItems());
            
            // Update document status
            document.setStatus(Document.DocumentStatus.COMPLETED);
            documentService.save(document);
            
            log.info("Analysis completed for document ID: {} in {} seconds", documentId, processingTime);
            
        } catch (Exception e) {
            log.error("Analysis failed for document ID: {}", documentId, e);
            analysis.setStatus(Analysis.AnalysisStatus.FAILED);
            analysis.setErrorMessage(e.getMessage());
            analysisRepository.save(analysis);
            
            document.setStatus(Document.DocumentStatus.FAILED);
            documentService.save(document);
        }
    }

    private Analysis createPendingAnalysis(Document document) {
        Analysis analysis = Analysis.builder()
                .document(document)
                .analysisType("COMPREHENSIVE")
                .status(Analysis.AnalysisStatus.PENDING)
                .build();
        return analysisRepository.save(analysis);
    }

    private void saveFeedbackItems(Analysis analysis, List<ClaudeAIService.FeedbackItem> items) {
        int order = 0;
        for (ClaudeAIService.FeedbackItem item : items) {
            FeedbackReport feedback = FeedbackReport.builder()
                    .analysis(analysis)
                    .section(item.getSection())
                    .feedbackType(FeedbackReport.FeedbackType.valueOf(item.getType()))
                    .severity(FeedbackReport.Severity.valueOf(item.getSeverity()))
                    .title(item.getTitle())
                    .content(item.getContent())
                    .pageReference(item.getPageReference())
                    .orderIndex(order++)
                    .build();
            feedbackReportRepository.save(feedback);
        }
    }

    public Analysis getAnalysisById(Long id) {
        return analysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found"));
    }

    public List<FeedbackReport> getFeedbackReports(Long analysisId) {
        Analysis analysis = getAnalysisById(analysisId);
        return feedbackReportRepository.findByAnalysisOrderByOrderIndexAsc(analysis);
    }
}
