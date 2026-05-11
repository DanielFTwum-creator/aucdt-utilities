package gh.edu.tuc.lyriastream.domain.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ls_licences")
public class LicenceEntity {

    public enum LicenceType { CC0, ROYALTY_FREE_TUC, COMMERCIAL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false, unique = true)
    private TrackEntity track;

    @Column(name = "licence_uuid", unique = true, nullable = false, length = 36)
    private String licenceUuid;

    @Enumerated(EnumType.STRING)
    @Column(name = "licence_type", nullable = false, length = 20)
    private LicenceType licenceType;

    @Column(name = "spdx_identifier", length = 50)
    private String spdxIdentifier;

    /** JSON array: [{modelId, spdxIdentifier, attribution}] */
    @Column(name = "model_licences_json", columnDefinition = "JSON")
    private String modelLicencesJson;

    @Column(name = "certificate_hash", length = 64, nullable = false)
    private String certificateHash;

    @Column(name = "pdf_path", length = 500)
    private String pdfPath;

    @CreationTimestamp
    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;

    public LicenceEntity() {}

    public LicenceEntity(Long id, TrackEntity track, String licenceUuid, LicenceType licenceType, String spdxIdentifier, String modelLicencesJson, String certificateHash, String pdfPath, LocalDateTime issuedAt) {
        this.id = id;
        this.track = track;
        this.licenceUuid = licenceUuid;
        this.licenceType = licenceType;
        this.spdxIdentifier = spdxIdentifier;
        this.modelLicencesJson = modelLicencesJson;
        this.certificateHash = certificateHash;
        this.pdfPath = pdfPath;
        this.issuedAt = issuedAt;
    }

    public static LicenceEntityBuilder builder() {
        return new LicenceEntityBuilder();
    }

    public static class LicenceEntityBuilder {
        private Long id;
        private TrackEntity track;
        private String licenceUuid;
        private LicenceType licenceType;
        private String spdxIdentifier;
        private String modelLicencesJson;
        private String certificateHash;
        private String pdfPath;

        public LicenceEntityBuilder id(Long id) { this.id = id; return this; }
        public LicenceEntityBuilder track(TrackEntity track) { this.track = track; return this; }
        public LicenceEntityBuilder licenceUuid(String licenceUuid) { this.licenceUuid = licenceUuid; return this; }
        public LicenceEntityBuilder licenceType(LicenceType licenceType) { this.licenceType = licenceType; return this; }
        public LicenceEntityBuilder spdxIdentifier(String spdxIdentifier) { this.spdxIdentifier = spdxIdentifier; return this; }
        public LicenceEntityBuilder modelLicencesJson(String modelLicencesJson) { this.modelLicencesJson = modelLicencesJson; return this; }
        public LicenceEntityBuilder certificateHash(String certificateHash) { this.certificateHash = certificateHash; return this; }
        public LicenceEntityBuilder pdfPath(String pdfPath) { this.pdfPath = pdfPath; return this; }

        public LicenceEntity build() {
            return new LicenceEntity(id, track, licenceUuid, licenceType, spdxIdentifier, modelLicencesJson, certificateHash, pdfPath, null);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TrackEntity getTrack() { return track; }
    public void setTrack(TrackEntity track) { this.track = track; }
    public String getLicenceUuid() { return licenceUuid; }
    public void setLicenceUuid(String uuid) { this.licenceUuid = uuid; }
    public LicenceType getLicenceType() { return licenceType; }
    public void setLicenceType(LicenceType type) { this.licenceType = type; }
    public String getSpdxIdentifier() { return spdxIdentifier; }
    public void setSpdxIdentifier(String spdx) { this.spdxIdentifier = spdx; }
    public String getModelLicencesJson() { return modelLicencesJson; }
    public void setModelLicencesJson(String json) { this.modelLicencesJson = json; }
    public String getCertificateHash() { return certificateHash; }
    public void setCertificateHash(String hash) { this.certificateHash = hash; }
    public String getPdfPath() { return pdfPath; }
    public void setPdfPath(String path) { this.pdfPath = path; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
}
