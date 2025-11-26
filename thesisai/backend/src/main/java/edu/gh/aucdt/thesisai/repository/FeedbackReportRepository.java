package edu.gh.aucdt.thesisai.repository;

import edu.gh.aucdt.thesisai.model.Analysis;
import edu.gh.aucdt.thesisai.model.FeedbackReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackReportRepository extends JpaRepository<FeedbackReport, Long> {
    List<FeedbackReport> findByAnalysisOrderByOrderIndexAsc(Analysis analysis);
}
