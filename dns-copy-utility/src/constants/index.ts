import type { DNSRecord, DNSType, DNSTypeStyle } from "../types";

export const OLD_DOMAIN = "aureliaattipoe.co";
export const NEW_DOMAIN = "sashmade.com";

export const TYPE_COLORS: Record<DNSType, DNSTypeStyle> = {
  A: { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  CNAME: { bg: "#f3e8ff", text: "#7c3aed", border: "#c4b5fd" },
  MX: { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
  NS: { bg: "#fff7ed", text: "#c2410c", border: "#fdba74" },
  TXT: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
};

export const RAW_RECORDS: DNSRecord[] = [
  { type: "A", name: "@", content: "66.226.72.199", ttl: 14400 },
  { type: "CNAME", name: "*", content: "OLD_DOMAIN", ttl: 14400 },
  { type: "MX", name: "@", content: "mail.OLD_DOMAIN", ttl: 14400, extra: "Priority: 10" },
  { type: "NS", name: "OLD_DOMAIN", content: "ns2.codero.com", ttl: 3600 },
  { type: "NS", name: "OLD_DOMAIN", content: "ns1.codero.com", ttl: 3600 },
  { type: "TXT", name: "_domainkey.OLD_DOMAIN", content: "o=-", ttl: 14400 },
  { type: "TXT", name: "_dmarc", content: "v=DMARC1; p=quarantine; rua=mailto:OLD_DOMAIN; ruf=mailto:admin@OLD_DOMAIN; pct=100; adkim=s; aspf=s; fo=1;", ttl: 14400 },
  { type: "TXT", name: "@", content: "google-site-verification=IgirXox1cIXHQ03zKBs_2M6v7uITjlJmidFSa_7wY5Y", ttl: 14400 },
  { type: "TXT", name: "@", content: "v=spf1 mx a ip4:66.226.72.199/32 ~all", ttl: 14400 },
  { type: "TXT", name: "_acme-challenge.OLD_DOMAIN", content: "WC1K3nGMVC_CLO2J-le8ZPzaEekPc6G4kbmWUxFeqM0", ttl: 14400 },
];
