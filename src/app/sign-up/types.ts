export interface PersonalDetails {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CompanyAssociation {
  companyName: string;
  companyBranch: string;
  companyRole: string;
  jobTitle: string;
  companyEmail: string;
  companyId?: string;
}

export interface VerificationDetails {
  termsAccepted: boolean;
  personalDetails: PersonalDetails;
  companyAssociation: CompanyAssociation;
}

export interface SignUpFormData {
  personalDetails: PersonalDetails;
  companyAssociation: CompanyAssociation;
  verificationDetails: VerificationDetails;
}
