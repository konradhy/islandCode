import { Badge } from "@/components/ui/badge";

export const LegalDocument = ({ title, citation, jurisdiction, docType, snippet }) => (
  <div className="mb-8 p-4 border border-gray-200 rounded-lg">
    <div className="flex justify-between items-start mb-2">
      <h2 className="text-xl text-blue-600 hover:underline cursor-pointer">{title}</h2>
      <Badge variant="outline">{docType}</Badge>
    </div>
    <p className="text-sm text-gray-600 mb-2">{citation}</p>
    <p className="text-sm text-gray-600 mb-2">Jurisdiction: {jurisdiction}</p>
    <p className="mt-2 text-sm text-gray-800">{snippet}</p>
  </div>
);