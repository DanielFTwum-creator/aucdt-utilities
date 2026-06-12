package gh.edu.techbridge.wms.lems;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/** LEMS academic programme (Lecturer Evaluation Management — hosted-in-WMS module). */
@Entity
@Table(name = "wms_lems_programmes")
public class LemsProgramme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String code;

    @Column(length = 2048)
    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "programme", cascade = CascadeType.ALL)
    private List<LemsCourse> courses = new ArrayList<>();

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public List<LemsCourse> getCourses() { return courses; }
}
