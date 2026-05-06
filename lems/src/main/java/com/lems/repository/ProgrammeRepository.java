package com.lems.repository;

import com.lems.model.Programme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgrammeRepository extends JpaRepository<Programme, Long> {
    Optional<Programme> findByName(String name);
    Optional<Programme> findByCode(String code);
    List<Programme> findAll();
}

