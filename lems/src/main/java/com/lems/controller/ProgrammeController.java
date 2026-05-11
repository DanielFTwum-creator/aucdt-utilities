package com.lems.controller;

import com.lems.model.Programme;
import com.lems.model.dto.ApiResponse;
import com.lems.service.ProgrammeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programmes")
@RequiredArgsConstructor
public class ProgrammeController {
    private final ProgrammeService programmeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Programme>>> getAllProgrammes() {
        List<Programme> programmes = programmeService.getAllProgrammes();
        return ResponseEntity.ok(ApiResponse.success(programmes, "Programmes retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Programme>> getProgrammeById(@PathVariable Long id) {
        return programmeService.getProgrammeById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success(p, "Programme retrieved")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Not found", "Programme not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Programme>> createProgramme(@RequestBody Programme programme) {
        Programme created = programmeService.createProgramme(programme);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Programme created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Programme>> updateProgramme(
            @PathVariable Long id, @RequestBody Programme programme) {
        try {
            Programme updated = programmeService.updateProgramme(id, programme);
            return ResponseEntity.ok(ApiResponse.success(updated, "Programme updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), "Failed to update programme"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProgramme(@PathVariable Long id) {
        programmeService.deleteProgramme(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Programme deleted"));
    }
}

