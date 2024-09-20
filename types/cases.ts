export interface Case {
  id: string;
  caseNumber: string;
  caseTitle: string;
  dateOfDelivery: Date;
  presidingJudge: string;
  neutralCitation: string;
  year: number;
  pdfUrl: string;
  keywordsSummary: string;
  fileSize: number;
  jurisdiction: string;
  court: string;
  searchableText: string;
  createdAt: Date;
}
export type Filters = {
  jurisdictions: string[];
  yearRange: [number, number];
  courts: string[];
};

export interface FailedCase {
  id: string;
  caseNumber: string;
  caseTitle: string;
  year: number;
  link: string;
  errorMessage: string;
  retryCount: number;
  lastAttempt: Date;
  createdAt: Date;
}
