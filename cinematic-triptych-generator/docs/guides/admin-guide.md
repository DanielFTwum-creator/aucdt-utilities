# Administrator Guide: Cinematic Triptych Generator
**Project:** Cinematic Triptych (v3.0.0)
**Core Requirement:** Strict React 19.2.4 Production Build

## 1. Overview
The Cinematic Triptych Generator is an institutional tool for rapid storyboarding and visual narrative development. It leverages AI to generate cohesive three-panel image prompts.

## 2. Refresh Protocol Monitoring
- **Access**: Click the "Refresh Protocol" button in the application header.
- **Tracking**: Monitor the 5-phase sequential refinement of the application core.
- **Compliance**: Every update must strictly adhere to the React 19.2.4 mandate.

## 3. Creative Asset Management
- **Variations**: Administrators can review the "Visual Style Variations" (Lighting, Palette, Lens) to ensure alignment with institutional brand aesthetics.
- **Generation History**: All generation events are recorded in the persistent institutional audit trail.
- **Zip Archiving**: Final storyboards should be exported using the "Download All as .zip" feature for official archival.

## 4. Audit Trail
The persistent audit trail records all `GENERATION_START` and `GENERATION_SUCCESS` events, viewable in the system console for institutional creative directors and IT personnel.

## 5. Troubleshooting
If generation fails:
1. Verify the Google Gemini API key configuration.
2. Ensure the client browser supports `JSZip` for multi-panel archiving.
3. Confirm that the React 19.2.4 environment is correctly initialized.
