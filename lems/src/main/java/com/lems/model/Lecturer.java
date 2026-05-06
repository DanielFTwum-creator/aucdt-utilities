package com.lems.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "lecturers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecturer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column
    private String department;

    @ManyToMany(mappedBy = "lecturers")
    private List<Course> courses;

    @OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL)
    private List<LecturerEvaluation> evaluations;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}

