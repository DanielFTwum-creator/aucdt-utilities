package gh.edu.techbridge.wms.lems;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/** LEMS lecturer under evaluation (hosted-in-WMS module). */
@Entity
@Table(name = "wms_lems_lecturers")
public class LemsLecturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    private String department;

    @JsonIgnoreProperties("lecturers")
    @ManyToMany(mappedBy = "lecturers", fetch = FetchType.EAGER)
    private List<LemsCourse> courses = new ArrayList<>();

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; }
    public void setLastName(String v) { this.lastName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getDepartment() { return department; }
    public void setDepartment(String v) { this.department = v; }
    public List<LemsCourse> getCourses() { return courses; }

    public String getFullName() { return firstName + " " + lastName; }
}
