export interface JobPostingData {
    jobTitle: string
    location: string
    remoteOptions: string
    workType: string
    payType: string
    payAmount: string
    recommendedCourse: string
    verificationTier: string
    jobDescription: string
    mustHaveQualifications: string[]
    niceToHaveQualifications: string[]
    jobSummary: string
    applicationDeadline: {
      date: string
      time: string
    }
    maxApplicants: string
    applicationQuestions: Array<{
      question: string
      type: string
      options?: string[]
      autoReject: boolean
    }>
    perksAndBenefits: string[]
  }
  