package com.lems.controller;

import com.lems.model.Lecturer;
import com.lems.model.dto.ApiResponse;
import com.lems.service.LecturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lecturers")
@RequiredArgsConstructor
public class LecturerController {
    private final LecturerService lecturerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Lecturer>>> getAllLecturers() {
        List<Lecturer> lecturers = lecturerService.getAllLecturers();
        return ResponseEntity.ok(ApiResponse.success(lecturers, "Lecturers retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lecturer>> getLecturerById(@PathVariable Long id) {
        return lecturerService.getLecturerById(id)
                .map(l -> ResponseEntity.ok(ApiResponse.success(l, "Lecturer retrieved")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Not found", "Lecturer not found")));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Lecturer>>> searchLecturers(@RequestParam String query) {
        List<Lecturer> lecturers = lecturerService.searchLecturers(query);
        return ResponseEntity.ok(ApiResponse.success(lecturers, "Lecturers retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Lecturer>> createLecturer(@RequestBody Lecturer lecturer) {
        Lecturer created = lecturerService.createLecturer(lecturer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Lecturer created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lecturer>> updateLecturer(
            @PathVariable Long id, @RequestBody Lecturer lecturer) {
        try {
            Lecturer updated = lecturerService.updateLecturer(id, lecturer);
            return ResponseEntity.ok(ApiResponse.success(updated, "Lecturer updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage(), "Failed to update lecturer"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLecturer(@PathVariable Long id) {
        lecturerService.deleteLecturer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Lecturer deleted"));
    }
}

