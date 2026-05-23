export interface Essay {
  id: number;
  part: number;
  title: string;
  theme: string;
  statusWord: string;
  publishDate: string;
  content: string;
  snippet: string;
  screenshotsDescription?: string;
}
