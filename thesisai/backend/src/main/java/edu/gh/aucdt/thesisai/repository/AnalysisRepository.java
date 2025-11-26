package edu.gh.aucdt.thesisai.repository;

import edu.gh.aucdt.thesisai.model.Analysis;
import edu.gh.aucdt.thesisai.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    List<Analysis> findByDocument(Document document);
    Optional<Analysis> findTopByDocumentOrderByCreatedAtDesc(Document document);
}
