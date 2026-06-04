package gh.edu.techbridge.wms.project;

/**
 * Per-project membership role (FR-PROJ-006) — distinct from the global FR-AUTH
 * Role. Ordered by privilege so guards can do `>=` comparisons.
 */
public enum ProjectRole {
    VIEWER,      // read-only
    COMMENTER,   // read + comment
    EDITOR,      // create/edit tasks
    OWNER;       // full control (members, settings, delete)

    /** True if this role is at least the required level. */
    public boolean atLeast(ProjectRole required) {
        return this.ordinal() >= required.ordinal();
    }
}
