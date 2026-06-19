package gh.edu.techbridge.wms.automation;

import gh.edu.techbridge.wms.project.Project;
import gh.edu.techbridge.wms.project.ProjectRepository;
import gh.edu.techbridge.wms.project.ProjectPermissionService;
import gh.edu.techbridge.wms.project.ProjectRole;
import gh.edu.techbridge.wms.user.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/automations")
public class AutomationController {

    private final AutomationRuleRepository ruleRepo;
    private final AutomationHistoryRepository historyRepo;
    private final ProjectRepository projectRepo;
    private final ProjectPermissionService perms;

    public AutomationController(AutomationRuleRepository ruleRepo, AutomationHistoryRepository historyRepo,
                                ProjectRepository projectRepo, ProjectPermissionService perms) {
        this.ruleRepo = ruleRepo;
        this.historyRepo = historyRepo;
        this.projectRepo = projectRepo;
        this.perms = perms;
    }

    private Project project(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    @GetMapping("/rules")
    public List<AutomationRule> listRules(@PathVariable Long projectId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.requireView(user, p);
        return ruleRepo.findByProjectId(projectId);
    }

    public record RuleRequest(
            @NotBlank String name,
            @NotBlank String triggerType,
            String triggerConfig,
            @NotBlank String conditionType,
            String conditionConfig,
            @NotBlank String actionType,
            @NotBlank String actionConfig
    ) {}

    @PostMapping("/rules")
    public ResponseEntity<AutomationRule> createRule(@PathVariable Long projectId, @RequestBody RuleRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);

        AutomationRule rule = new AutomationRule(
                projectId,
                req.name(),
                req.triggerType(),
                req.triggerConfig(),
                req.conditionType(),
                req.conditionConfig(),
                req.actionType(),
                req.actionConfig(),
                user.getId()
        );
        AutomationRule saved = ruleRepo.save(rule);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/rules/{ruleId}")
    public AutomationRule updateRule(@PathVariable Long projectId, @PathVariable Long ruleId,
                                     @RequestBody RuleRequest req, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);

        AutomationRule rule = ruleRepo.findById(ruleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rule not found"));
        if (!rule.getProjectId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rule is not in this project");
        }

        if (req.name() != null) rule.setName(req.name());
        if (req.triggerType() != null) rule.setTriggerType(req.triggerType());
        if (req.triggerConfig() != null) rule.setTriggerConfig(req.triggerConfig());
        if (req.conditionType() != null) rule.setConditionType(req.conditionType());
        if (req.conditionConfig() != null) rule.setConditionConfig(req.conditionConfig());
        if (req.actionType() != null) rule.setActionType(req.actionType());
        if (req.actionConfig() != null) rule.setActionConfig(req.actionConfig());

        return ruleRepo.save(rule);
    }

    @PutMapping("/rules/{ruleId}/toggle")
    public AutomationRule toggleRule(@PathVariable Long projectId, @PathVariable Long ruleId,
                                     @RequestParam boolean active, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);

        AutomationRule rule = ruleRepo.findById(ruleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rule not found"));
        if (!rule.getProjectId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rule is not in this project");
        }

        rule.setActive(active);
        return ruleRepo.save(rule);
    }

    @DeleteMapping("/rules/{ruleId}")
    public ResponseEntity<?> deleteRule(@PathVariable Long projectId, @PathVariable Long ruleId, Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.require(user, p, ProjectRole.EDITOR);
        perms.requireWritable(p);

        AutomationRule rule = ruleRepo.findById(ruleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rule not found"));
        if (!rule.getProjectId().equals(projectId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rule is not in this project");
        }

        ruleRepo.delete(rule);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public List<AutomationHistory> getHistory(@PathVariable Long projectId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "50") int limit,
                                              Authentication auth) {
        User user = perms.currentUser(auth);
        Project p = project(projectId);
        perms.requireView(user, p);

        int cappedLimit = Math.min(Math.max(limit, 1), 100);
        return historyRepo.findByProjectIdOrderByRunAtDesc(projectId, PageRequest.of(page, cappedLimit));
    }
}
