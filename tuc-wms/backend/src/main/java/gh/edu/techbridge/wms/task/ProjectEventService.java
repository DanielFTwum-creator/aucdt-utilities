package gh.edu.techbridge.wms.task;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Real-time board updates via Server-Sent Events (FR-KB: near real-time, <=5s).
 * Maintains per-project subscriber lists; task mutations publish an event that
 * is pushed to all current subscribers of that project. In-memory (single
 * instance) — fine for the MVP; move to a broker if scaled horizontally.
 */
@Service
public class ProjectEventService {

    private final Map<Long, List<SseEmitter>> subscribers = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long projectId) {
        // 0L timeout = no server-side timeout; the proxy/client manage lifecycle.
        SseEmitter emitter = new SseEmitter(0L);
        List<SseEmitter> list = subscribers.computeIfAbsent(projectId, k -> new CopyOnWriteArrayList<>());
        list.add(emitter);
        emitter.onCompletion(() -> list.remove(emitter));
        emitter.onTimeout(() -> { list.remove(emitter); emitter.complete(); });
        emitter.onError(e -> list.remove(emitter));
        try {
            emitter.send(SseEmitter.event().name("connected").data(Map.of("projectId", projectId)));
        } catch (IOException ignored) { }
        return emitter;
    }

    /** Push a task event ("task.created" / "task.updated" / "task.deleted") to a project's subscribers. */
    public void publish(Long projectId, String event, Object payload) {
        List<SseEmitter> list = subscribers.get(projectId);
        if (list == null) return;
        for (SseEmitter emitter : list) {
            try {
                emitter.send(SseEmitter.event().name(event).data(payload));
            } catch (Exception e) {
                list.remove(emitter);   // drop broken connections
            }
        }
    }
}
