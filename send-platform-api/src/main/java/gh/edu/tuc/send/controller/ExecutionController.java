package gh.edu.tuc.send.controller;

import gh.edu.tuc.send.entity.ExecutionInstance;
import gh.edu.tuc.send.service.ReportJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/executions")
@RequiredArgsConstructor
public class ExecutionController {

    private final ReportJobService jobService;

    @GetMapping
    public Page<ExecutionInstance> listAll(@PageableDefault(size = 25) Pageable pageable) {
        return jobService.getAllExecutions(pageable);
    }
}
