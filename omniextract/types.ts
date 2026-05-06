
// Make pdfjsLib available on the window object for TypeScript
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export interface MessageBoxState {
  visible: boolean;
  title: string;
  content: string;
  isError: boolean;
}
