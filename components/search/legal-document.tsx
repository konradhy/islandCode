import { Badge } from "@/components/ui/badge";
import { Case } from "@/types/cases";

interface LegalDocumentProps {
  case: Case;
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({
  case: caseData,
}) => (
  <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h2 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">
        {caseData.caseTitle}
      </h2>
      <div className="flex space-x-2">
        <Badge variant="outline">{caseData.year}</Badge>
        <Badge variant="secondary">{caseData.jurisdiction}</Badge>
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-2">
      Case Number: {caseData.caseNumber}
    </p>
    <p className="text-sm text-gray-600 mb-2">{caseData.court}</p>
    <p className="text-sm text-gray-600 mb-3">{caseData.presidingJudge}</p>
    <a
      href={caseData.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
    >
      View Case
    </a>
  </div>
);
