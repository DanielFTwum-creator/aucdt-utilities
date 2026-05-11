package gh.edu.tuc.send.service;

import gh.edu.tuc.send.entity.AuditLog;
import gh.edu.tuc.send.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository repo;

    @Async
    public void log(String actor, String action, String target,
                    AuditLog.AuditStatus status, String details) {
        var entry = new AuditLog();
        entry.setActor(actor);
        entry.setAction(action);
        entry.setTarget(target);
        entry.setStatus(status);
        entry.setDetails(details);
        repo.save(entry);
    }

    public void log(String actor, String action, String target) {
        log(actor, action, target, AuditLog.AuditStatus.SUCCESS, null);
    }

    public Page<AuditLog> getLogs(Pageable pageable) {
        return repo.findAllByOrderByTimestampDesc(pageable);
    }

    public Page<AuditLog> getLogsByActor(String actor, Pageable pageable) {
        return repo.findByActorOrderByTimestampDesc(actor, pageable);
    }
}
