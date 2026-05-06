package com.lems.service;

import com.lems.model.Programme;
import com.lems.repository.ProgrammeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgrammeService {
    private final ProgrammeRepository programmeRepository;

    public List<Programme> getAllProgrammes() {
        return programmeRepository.findAll();
    }

    public Optional<Programme> getProgrammeById(Long id) {
        return programmeRepository.findById(id);
    }

    public Programme createProgramme(Programme programme) {
        return programmeRepository.save(programme);
    }

    public Programme updateProgramme(Long id, Programme programme) {
        return programmeRepository.findById(id)
                .map(existing -> {
                    existing.setName(programme.getName());
                    existing.setCode(programme.getCode());
                    existing.setDescription(programme.getDescription());
                    return programmeRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Programme not found"));
    }

    public void deleteProgramme(Long id) {
        programmeRepository.deleteById(id);
    }
}

