export type DNSType = "A" | "CNAME" | "MX" | "NS" | "TXT";

export interface DNSTypeStyle {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
}

export interface DNSRecord {
  readonly type: DNSType;
  readonly name: string;
  readonly content: string;
  readonly ttl: number;
  readonly extra?: string;
}

export type ThemeType = "dark" | "light";
