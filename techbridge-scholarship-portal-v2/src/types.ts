
export interface ScholarDetails {
  title: string;
  fullName: string;
  idNumber: string;
  parentName: string; // Son/Daughter of
  address: string;
  email: string;
  phone: string;
}

export interface AgreementMeta {
  madeAt: string; // Location
  date: string;
}

export interface ProgramDetails {
  department: string;
  programDuration: string; // duration of...
  fundingSource: string; // funding from...
  phdSubject: string; // completion of PhD in...
  serviceYears: number; // serve Techbridge for not less than...
}

export interface PersonDetails {
  name: string;
  idNumber: string;
  address?: string;
  fatherName?: string;
  phone?: string;
}

export interface WitnessDetails {
  techbridgeWitness: PersonDetails;
  scholarWitness: PersonDetails;
}

export interface FormData {
  meta: AgreementMeta;
  scholar: ScholarDetails;
  program: ProgramDetails;
  guarantor: PersonDetails;
  witnesses: WitnessDetails;
  signatures: {
    scholarSign: string;
    signatureImage?: string; // Base64 data URL
    signatureType: 'text' | 'draw';
    agreedToTerms: boolean;
  };
}

export const INITIAL_DATA: FormData = {
  meta: {
    madeAt: "Oyibi",
    date: new Date().toISOString().split('T')[0],
  },
  scholar: {
    title: "Mr",
    fullName: "",
    idNumber: "",
    parentName: "",
    address: "",
    email: "",
    phone: "",
  },
  program: {
    department: "DMCD",
    programDuration: "3 Years",
    fundingSource: "TECHBRIDGE Scholarship Fund",
    phdSubject: "",
    serviceYears: 10,
  },
  guarantor: {
    name: "",
    idNumber: "",
  },
  witnesses: {
    techbridgeWitness: {
      name: "",
      fatherName: "",
      idNumber: "",
      address: "",
      phone: "",
    },
    scholarWitness: {
      name: "",
      fatherName: "",
      idNumber: "",
      address: "",
      phone: "",
    },
  },
  signatures: {
    scholarSign: "",
    signatureType: 'text',
    agreedToTerms: false,
  },
};
