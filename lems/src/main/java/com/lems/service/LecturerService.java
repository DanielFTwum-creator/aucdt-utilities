package com.lems.service;

import com.lems.model.Lecturer;
import com.lems.repository.LecturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LecturerService {
    private final LecturerRepository lecturerRepository;

    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }

    public Optional<Lecturer> getLecturerById(Long id) {
        return lecturerRepository.findById(id);
    }

    public List<Lecturer> searchLecturers(String query) {
        return lecturerRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    public Lecturer createLecturer(Lecturer lecturer) {
        return lecturerRepository.save(lecturer);
    }

    public Lecturer updateLecturer(Long id, Lecturer lecturer) {
        return lecturerRepository.findById(id)
                .map(existing -> {
                    existing.setFirstName(lecturer.getFirstName());
                    existing.setLastName(lecturer.getLastName());
                    existing.setEmail(lecturer.getEmail());
                    existing.setDepartment(lecturer.getDepartment());
                    return lecturerRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }

    public void deleteLecturer(Long id) {
        lecturerRepository.deleteById(id);
    }
}

