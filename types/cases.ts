export interface Case {
  id: string;
  caseTitle: string;
  caseNumber: string;
  dateOfDelivery: string;
  presidingJudge: string;
  neutralCitation: string;
  year: number;
  jurisdiction: string;
  court: string;
  keywordsSummary: string;
  pdfUrl: string;
  fileSize: number;
}

export type Filters = {
  jurisdictions: string[];
  yearRange: [number, number];
  courts: string[];
};
