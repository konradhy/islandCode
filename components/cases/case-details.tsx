"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Case } from "@/types/cases";
import { CaseAnalysis } from "@/types/caseAnalysis";
import Display from "@/components/case-analysis/display";

const CaseDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const [showPDF, setShowPDF] = useState(true);
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Failed to fetch case details. Please try again.");
    }
  };

  const handleDownload = () => {
    if (caseDetails?.pdfUrl) {
      window.open(caseDetails.pdfUrl, "_blank");
    }
  };

  const togglePDFView = () => {
    setShowPDF(!showPDF);
  };

  const handleAnalyzePDF = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // First, extract the text from the PDF
      const extractResponse = await fetch('/api/extract-url', {
        method: 'POST',
        body: JSON.stringify({ pdfUrl: caseDetails?.pdfUrl }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from PDF");
      }

      const extractData = await extractResponse.json();

      // Then, analyze the extracted text
      const analyzeResponse = await fetch("/api/analyse-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractData.text }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze case");
      }

      const analyzeData = await analyzeResponse.json();
      if (analyzeData.error) {
        throw new Error(analyzeData.error);
      }

      setAnalysis(analyzeData.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!caseDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to Results
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{caseDetails.caseTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Case Number</p>
                <p>{caseDetails.caseNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Delivery</p>
                <p>{caseDetails.dateOfDelivery.toLocaleString("en-GB", { timeZone: "UTC" })}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Presiding Judge</p>
                <p>{caseDetails.presidingJudge}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Neutral Citation</p>
                <p>{caseDetails.neutralCitation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p>{caseDetails.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Jurisdiction</p>
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
            <CardTitle className="text-xl font-semibold">Case Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{caseDetails.keywordsSummary}</p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-500">File Size: {(caseDetails.fileSize / 1024 / 1024).toFixed(2)} MB</p>
          <div>
            <Button
              className="inline-flex items-center mr-4"
              onClick={handleAnalyzePDF}
              disabled={isAnalyzing}
            >
              <FileText className="mr-2" size={20} />
              {isAnalyzing ? "Analyzing..." : "Analyze PDF"}
            </Button>
            <Button className="inline-flex items-center mr-4" onClick={togglePDFView}>
              <Eye className="mr-2" size={20} />
              {showPDF ? "Hide PDF" : "Preview PDF"}
            </Button>
            <Button className="inline-flex items-center" onClick={handleDownload}>
              <Download className="mr-2" size={20} />
              Download PDF
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showPDF && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">PDF Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src={caseDetails.pdfUrl ? `${caseDetails.pdfUrl}#toolbar=0` : ""}
                width="100%"
                height="600px"
                title="PDF Preview"
              >
                This browser does not support PDFs. Please download the PDF to view it.
              </iframe>
            </CardContent>
          </Card>
        )}

        {analysis && <Display analysis={analysis} />}
      </main>
    </div>
  );
};

export default CaseDetails;