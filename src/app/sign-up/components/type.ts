export type formData = {
    id: string;
    first_name: string;
    last_name: string;
    country_code: string;
    phone: string;
    email: string;
    emailVerified: boolean;
    password: string;
    confirmPassword: string;
    company_name: { id: string; name: string };
    company_branch: { id: string; name: string };
    company_role: string;
    job_title: string;
    company_email: string;
    signature: string | null;
    terms_accepted: boolean;
  };
  
  