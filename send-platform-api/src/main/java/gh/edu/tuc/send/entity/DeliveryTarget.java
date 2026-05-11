package gh.edu.tuc.send.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "delivery_targets")
@Getter @Setter
public class DeliveryTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("job-delivery")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private ReportJob job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryChannel channel;

    @Column(columnDefinition = "TEXT")
    private String configJson;   // serialised channel-specific config

    @Column(nullable = false)
    private boolean active = true;

    public enum DeliveryChannel { EMAIL, SHAREPOINT, GDRIVE, SFTP, REST_API }
}
