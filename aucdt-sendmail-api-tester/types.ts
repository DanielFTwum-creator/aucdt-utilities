
export enum Environment {
  DEV = 'dev',
  QA = 'qa',
  UAT = 'uat',
}

export interface FormData {
  applicantId: string;
  fullName: string;
  senderEmailId: string;
  receiverEmailId: string;
  subject: string;
  message: string;
  attachment?: File | null;
}

export interface ApiResponse {
  status: number | null;
  data: string;
  error: string | null;
}
