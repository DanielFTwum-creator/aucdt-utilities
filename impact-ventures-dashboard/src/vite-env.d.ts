interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_REDIRECT_URI?: string;
  [key: string]: string | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
