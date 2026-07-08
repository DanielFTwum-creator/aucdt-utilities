import { IPData, BlockedIpRecord } from "./types";

export const DEFAULT_SERVER_LOCATION = {
  name: "mail.aucdt.edu.gh (Accra, Ghana)",
  lat: 5.6037,
  lon: -0.1870,
  countryCode: "GH"
};

export const DEFAULT_BANNED_IPS: IPData[] = [
  {
    ip: "36.255.220.145",
    jail: "ssh",
    country: "China",
    countryCode: "CN",
    city: "Shanghai",
    lat: 31.2243,
    lon: 121.4691,
    isp: "China Telecom",
    status: "success"
  },
  {
    ip: "43.156.61.33",
    jail: "ssh",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    lat: 35.6762,
    lon: 139.6503,
    isp: "Tencent Building",
    status: "success"
  },
  {
    ip: "43.165.170.198",
    jail: "ssh",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    lat: 35.6762,
    lon: 139.6503,
    isp: "Zenlayer Inc",
    status: "success"
  },
  {
    ip: "45.15.226.100",
    jail: "ssh",
    country: "Netherlands",
    countryCode: "NL",
    city: "Amsterdam",
    note: "allocation only",
    lat: 52.3676,
    lon: 4.9041,
    isp: "Liteserver B.V.",
    status: "success"
  },
  {
    ip: "45.148.10.121",
    jail: "ssh",
    country: "Netherlands",
    countryCode: "NL",
    city: "Amsterdam",
    note: "allocation only",
    lat: 52.3676,
    lon: 4.9041,
    isp: "TECHOFF SRV LIMITED",
    status: "success"
  },
  {
    ip: "45.148.10.141",
    jail: "ssh",
    country: "Netherlands",
    countryCode: "NL",
    city: "Amsterdam",
    note: "allocation only",
    lat: 52.3676,
    lon: 4.9041,
    isp: "TECHOFF SRV LIMITED",
    status: "success"
  },
  {
    ip: "45.148.10.151",
    jail: "ssh",
    country: "Netherlands",
    countryCode: "NL",
    city: "Amsterdam",
    note: "allocation only",
    lat: 52.3676,
    lon: 4.9041,
    isp: "TECHOFF SRV LIMITED",
    status: "success"
  },
  {
    ip: "61.223.116.74",
    jail: "ssh",
    country: "Taiwan",
    countryCode: "TW",
    city: "Changhua",
    lat: 24.0518,
    lon: 120.5161,
    isp: "Chunghwa Telecom",
    status: "success"
  },
  {
    ip: "68.178.160.25",
    jail: "plesk-modsecurity",
    country: "India",
    countryCode: "IN",
    city: "Mumbai",
    lat: 19.0760,
    lon: 72.8777,
    isp: "GoDaddy.com, LLC",
    status: "success"
  },
  {
    ip: "81.30.98.81",
    jail: "plesk-postfix",
    country: "Germany",
    countryCode: "DE",
    city: "Kiel",
    lat: 54.3233,
    lon: 10.1228,
    isp: "Deutsche Telekom",
    status: "success"
  },
  {
    ip: "83.219.249.173",
    jail: "ssh",
    country: "Russia",
    countryCode: "RU",
    city: "Moscow",
    lat: 55.7558,
    lon: 37.6173,
    isp: "Rostelecom",
    status: "success"
  },
  {
    ip: "83.246.133.16",
    jail: "ssh",
    country: "Russia",
    countryCode: "RU",
    city: "Barnaul",
    lat: 53.3606,
    lon: 83.7636,
    isp: "TTK",
    status: "success"
  },
  {
    ip: "91.92.40.10",
    jail: "ssh",
    country: "Bulgaria",
    countryCode: "BG",
    city: "Sofia",
    lat: 42.6977,
    lon: 23.3219,
    isp: "Neterra Ltd",
    status: "success"
  },
  {
    ip: "106.75.25.139",
    jail: "ssh",
    country: "China",
    countryCode: "CN",
    city: "Shanghai",
    lat: 31.2243,
    lon: 121.4691,
    isp: "Ucloud Technology",
    status: "success"
  },
  {
    ip: "118.193.45.134",
    jail: "ssh",
    country: "China",
    countryCode: "CN",
    city: "Beijing",
    lat: 39.9042,
    lon: 116.4074,
    isp: "Beijing Capital Online",
    status: "success"
  },
  {
    ip: "120.36.82.210",
    jail: "ssh",
    country: "China",
    countryCode: "CN",
    city: "Fuzhou",
    lat: 26.0614,
    lon: 119.3061,
    isp: "China Unicom",
    status: "success"
  },
  {
    ip: "125.137.115.145",
    jail: "ssh",
    country: "South Korea",
    countryCode: "KR",
    city: "Seoul",
    lat: 37.5665,
    lon: 126.9780,
    isp: "SK Broadband",
    status: "success"
  },
  {
    ip: "125.212.244.35",
    jail: "ssh",
    country: "Vietnam",
    countryCode: "VN",
    city: "Hanoi",
    lat: 21.0285,
    lon: 105.8542,
    isp: "Viettel Group",
    status: "success"
  },
  {
    ip: "137.74.47.71",
    jail: "plesk-panel",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    note: "Paris (OVH)",
    lat: 48.8566,
    lon: 2.3522,
    isp: "OVH SAS",
    status: "success"
  },
  {
    ip: "152.32.163.183",
    jail: "ssh",
    country: "Hong Kong",
    countryCode: "HK",
    city: "Hong Kong",
    lat: 22.3193,
    lon: 114.1694,
    isp: "Tencent Building",
    status: "success"
  },
  {
    ip: "154.161.187.225",
    jail: "plesk-panel",
    country: "Ghana",
    countryCode: "GH",
    city: "Accra",
    lat: 5.6037,
    lon: -0.1870,
    isp: "MTN Ghana",
    status: "success"
  },
  {
    ip: "172.188.89.41",
    jail: "plesk-panel",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    note: "London (Azure)",
    lat: 51.5074,
    lon: -0.1278,
    isp: "Microsoft Corporation",
    status: "success"
  },
  {
    ip: "176.53.159.197",
    jail: "ssh",
    country: "Turkey",
    countryCode: "TR",
    city: "Istanbul",
    lat: 41.0082,
    lon: 28.9784,
    isp: "Radore Ortak Altyapi",
    status: "success"
  },
  {
    ip: "178.16.55.216",
    jail: "plesk-postfix",
    country: "Germany",
    countryCode: "DE",
    city: "Kassel",
    lat: 51.3127,
    lon: 9.4797,
    isp: "1&1 IONOS SE",
    status: "success"
  },
  {
    ip: "187.191.48.23",
    jail: "ssh",
    country: "Mexico",
    countryCode: "MX",
    city: "Mexico City",
    lat: 19.4326,
    lon: -99.1332,
    isp: "Uninet",
    status: "success"
  },
  {
    ip: "189.204.230.91",
    jail: "ssh",
    country: "Mexico",
    countryCode: "MX",
    city: "Mexico City",
    lat: 19.4326,
    lon: -99.1332,
    isp: "Alestra",
    status: "success"
  },
  {
    ip: "198.244.140.51",
    jail: "ssh",
    country: "Canada",
    countryCode: "CA",
    city: "Montreal",
    lat: 45.5017,
    lon: -73.5673,
    isp: "OVH SAS",
    status: "success"
  }
];

export const MOCK_FAIL2BAN_LOGS = `2026-07-03 10:14:22,104 fail2ban.jail   [4521]: INFO    Creating new jail 'ssh'
2026-07-03 10:14:22,125 fail2ban.jail   [4521]: INFO    Jail 'ssh' uses pyinotify
2026-07-03 10:14:22,143 fail2ban.jail   [4521]: INFO    Creating new jail 'plesk-panel'
2026-07-03 10:14:22,145 fail2ban.jail   [4521]: INFO    Creating new jail 'plesk-postfix'
2026-07-03 10:15:01,232 fail2ban.filter [4521]: INFO    [ssh] Found 36.255.220.145 - 2026-07-03 10:15:00
2026-07-03 10:15:02,510 fail2ban.actions[4521]: NOTICE  [ssh] Ban 36.255.220.145
2026-07-03 10:15:10,111 fail2ban.filter [4521]: INFO    [ssh] Found 106.75.25.139 - 2026-07-03 10:15:09
2026-07-03 10:15:12,402 fail2ban.actions[4521]: NOTICE  [ssh] Ban 106.75.25.139
2026-07-03 10:16:30,129 fail2ban.filter [4521]: INFO    [plesk-panel] Found 137.74.47.71 - 2026-07-03 10:16:29
2026-07-03 10:16:33,023 fail2ban.actions[4521]: NOTICE  [plesk-panel] Ban 137.74.47.71
2026-07-03 10:17:44,555 fail2ban.filter [4521]: INFO    [plesk-postfix] Found 81.30.98.81 - 2026-07-03 10:17:42
2026-07-03 10:17:46,101 fail2ban.actions[4521]: NOTICE  [plesk-postfix] Ban 81.30.98.81
2026-07-03 10:18:22,912 fail2ban.filter [4521]: INFO    [ssh] Found 43.156.61.33 - 2026-07-03 10:18:20
2026-07-03 10:18:25,004 fail2ban.actions[4521]: NOTICE  [ssh] Ban 43.156.61.33
2026-07-03 10:19:12,414 fail2ban.filter [4521]: INFO    [ssh] Found 118.193.45.134 - 2026-07-03 10:19:11
2026-07-03 10:19:15,000 fail2ban.actions[4521]: NOTICE  [ssh] Ban 118.193.45.134
2026-07-03 10:20:01,883 fail2ban.filter [4521]: INFO    [ssh] Found 120.36.82.210 - 2026-07-03 10:20:00
2026-07-03 10:20:04,112 fail2ban.actions[4521]: NOTICE  [ssh] Ban 120.36.82.210
2026-07-03 10:21:55,204 fail2ban.filter [4521]: INFO    [plesk-panel] Found 172.188.89.41 - 2026-07-03 10:21:54
2026-07-03 10:21:57,911 fail2ban.actions[4521]: NOTICE  [plesk-panel] Ban 172.188.89.41
2026-07-03 10:23:10,402 fail2ban.filter [4521]: INFO    [plesk-postfix] Found 178.16.55.216 - 2026-07-03 10:23:08
2026-07-03 10:23:12,110 fail2ban.actions[4521]: NOTICE  [plesk-postfix] Ban 178.16.55.216`;

export const INITIAL_BLOCKED_HISTORY: BlockedIpRecord[] = [
  {
    ip: "185.220.101.5",
    timestamp: "2026-07-02 14:22:15",
    jail: "recidive",
    country: "Germany",
    city: "Berlin",
    isp: "Tor Exit Node Provider"
  },
  {
    ip: "193.56.28.14",
    timestamp: "2026-07-02 18:45:30",
    jail: "plesk-modsecurity",
    country: "France",
    city: "Lyon",
    isp: "Scaleway LRD"
  },
  {
    ip: "103.145.12.99",
    timestamp: "2026-07-03 01:10:05",
    jail: "ssh",
    country: "India",
    city: "Bangalore",
    isp: "Reliance Jio Infocomm"
  },
  {
    ip: "89.248.165.71",
    timestamp: "2026-07-03 08:33:12",
    jail: "ssh",
    country: "Netherlands",
    city: "Haarlem",
    isp: "Asis-Lines Ltd"
  },
  {
    ip: "210.12.85.194",
    timestamp: "2026-07-03 11:59:47",
    jail: "plesk-panel",
    country: "South Korea",
    city: "Incheon",
    isp: "Korea Telecom"
  }
];
