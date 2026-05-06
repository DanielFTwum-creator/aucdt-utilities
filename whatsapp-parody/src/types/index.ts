export type Sender = "me" | "them";

export interface Message {
  readonly id: string;
  readonly sender: Sender;
  readonly content: string | React.ReactNode;
  readonly time: string;
  readonly reaction?: string;
  readonly isDashboard?: boolean;
}
