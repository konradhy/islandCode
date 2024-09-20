"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CaseAnalysis } from "@/types/caseAnalysis";

export default function CaseAnalysisClient() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyse-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze case");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your legal case text here..."
        className="w-full h-64 mb-4"
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze Case"}
      </Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {analysis && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Analysis Results:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}
