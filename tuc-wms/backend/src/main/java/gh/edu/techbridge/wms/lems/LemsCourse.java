package gh.edu.techbridge.wms.lems;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/** LEMS course — belongs to a programme, taught by one or more lecturers. */
@Entity
@Table(name = "wms_lems_courses")
public class LemsCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String code;

    @Column(length = 2048)
    private String description;

    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "programme_id", nullable = false)
    @JsonIgnoreProperties("courses")
    private LemsProgramme programme;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "wms_lems_course_lecturers",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "lecturer_id"))
    @JsonIgnoreProperties("courses")
    private List<LemsLecturer> lecturers = new ArrayList<>();

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer v) { this.semester = v; }
    public LemsProgramme getProgramme() { return programme; }
    public void setProgramme(LemsProgramme v) { this.programme = v; }
    public List<LemsLecturer> getLecturers() { return lecturers; }
    public void setLecturers(List<LemsLecturer> v) { this.lecturers = v; }
}
