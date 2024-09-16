"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Case } from "@/types/cases";

const CaseDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const [showPDF, setShowPDF] = useState(true);
  console.log("pdfUrl", caseDetails?.pdfUrl);

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      const response = await fetch(`/api/cases/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch case details");
      }
      const data = await response.json();
      setCaseDetails(data);
    } catch (error) {
      console.error("Error fetching case details:", error);
    }
  };

  if (!caseDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const handleDownload = () => {
    if (caseDetails?.pdfUrl) {
      window.open(caseDetails.pdfUrl, "_blank");
    }
  };

  const togglePDFView = () => {
    setShowPDF(!showPDF);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/search"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Results
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {caseDetails.caseTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Case Number</p>
                <p>{caseDetails.caseNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date of Delivery
                </p>
                <p>{caseDetails.dateOfDelivery}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Presiding Judge
                </p>
                <p>{caseDetails.presidingJudge}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Neutral Citation
                </p>
                <p>{caseDetails.neutralCitation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p>{caseDetails.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Jurisdiction
                </p>
                <p>{caseDetails.jurisdiction}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Court</p>
                <p>{caseDetails.court}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Case Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{caseDetails.keywordsSummary}</p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-500">
            File Size: {(caseDetails.fileSize / 1024 / 1024).toFixed(2)} MB
          </p>
          <div>
            <Button
              className="inline-flex items-center mr-4"
              onClick={togglePDFView}
            >
              <Eye className="mr-2" size={20} />
              {showPDF ? "Hide PDF" : "Preview PDF"}
            </Button>
            <Button
              className="inline-flex items-center"
              onClick={handleDownload}
            >
              <Download className="mr-2" size={20} />
              Download PDF
            </Button>
          </div>
        </div>

        {showPDF && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                PDF Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src={
                  caseDetails.pdfUrl ? `${caseDetails.pdfUrl}#toolbar=0` : ""
                }
                width="100%"
                height="600px"
                title="PDF Preview"
              >
                This browser does not support PDFs. Please download the PDF to
                view it.
              </iframe>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CaseDetails;
