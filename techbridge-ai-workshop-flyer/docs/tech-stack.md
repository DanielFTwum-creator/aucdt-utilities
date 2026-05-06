# Technology Stack

## Frontend Framework
- **React (v19.2.4)**
  - Component-based architecture.
  - Functional components with Hooks.
  - Sourced via ESM.sh for browser-native module loading.

## Styling
- **Tailwind CSS (v3.4)**
  - Utility-first CSS framework.
  - Loaded via CDN for rapid prototyping and runtime compilation.
  - Custom configuration for typography (Playfair Display, Poppins) and color palette.

## Language
- **TypeScript**
  - Strong typing for interfaces (`Speaker`, `EventDetail`).
  - Ensures data integrity across component props.

## Assets & typography
- **Google Fonts**: Playfair Display (Headings), Poppins (Body), Bebas Neue.
- **Icons**: Emoji-based icons (for lightweight performance) and CSS shapes.

## Build/Runtime
- **ES Modules**: Browser-native ES module imports via `<script type="importmap">`.
- **Babel (Implicit)**: In-browser transpilation (assumed for `.tsx` execution in this specific environment) or standard Vite build pipeline depending on deployment target.
