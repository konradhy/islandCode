"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CaseAnalysis } from "@/types/caseAnalysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PDFUploader from "./pdf-uploader";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CaseAnalysisClient() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtractedText = (text: string) => {
    setInputText(text);
  
  };

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
    <div className="container mx-auto p-4">
      <PDFUploader onExtractedText={handleExtractedText} />
 
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze Case"}
      </Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {analysis && (
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-4">
            {analysis.metadata.case_name}
          </h1>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="arguments">Arguments</TabsTrigger>
              <TabsTrigger value="implications">Implications</TabsTrigger>
              <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
              <TabsTrigger value="legislation">Legislation</TabsTrigger>
              <TabsTrigger value="key-persons">Key Persons</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Case Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Citation:</strong> {analysis.metadata.citation}
                  </p>
                  <p>
                    <strong>Court:</strong> {analysis.metadata.court}
                  </p>
                  <p>
                    <strong>Parties:</strong>{" "}
                    {analysis.metadata.parties.plaintiff} vs.{" "}
                    {analysis.metadata.parties.defendant}
                  </p>
                  <p>
                    <strong>Decision:</strong>{" "}
                    {analysis.decision_and_precedents.decision}
                  </p>
                  <h3 className="font-semibold mt-4 mb-2">Summary</h3>
                  <p>{analysis.final_summary}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="procedural-history">
                    <AccordionTrigger>Procedural History</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {analysis.metadata.procedural_history.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="key-facts">
                    <AccordionTrigger>Key Facts</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {analysis.factual_background.key_facts.map(
                          (fact, index) => (
                            <li key={index}>{fact}</li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="legal-issues">
                    <AccordionTrigger>Legal Issues</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {analysis.factual_background.legal_issues.map(
                          (issue, index) => (
                            <li key={index}>{issue}</li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ratio-decidendi">
                    <AccordionTrigger>Ratio Decidendi</AccordionTrigger>
                    <AccordionContent>
                      <p>{analysis.decision_and_precedents.ratio_decidendi}</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="key-precedents">
                    <AccordionTrigger>Key Precedents</AccordionTrigger>
                    <AccordionContent>
                      {analysis.decision_and_precedents.key_precedents.map(
                        (precedent, index) => (
                          <div key={index} className="mb-4">
                            <h4 className="font-semibold">
                              {precedent.case_name}
                            </h4>
                            <p>
                              <strong>Relevance:</strong> {precedent.relevance}
                            </p>
                            {precedent.quote && (
                              <p>
                                <strong>Quote:</strong> &quot;{precedent.quote}&quot;
                              </p>
                            )}
                            {precedent.principle && (
                              <p>
                                <strong>Principle:</strong>{" "}
                                {precedent.principle}
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="arguments">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="plaintiff-arguments">
                    <AccordionTrigger>Plaintiff Arguments</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {analysis.arguments_and_reasoning.plaintiff_arguments.map(
                          (arg, index) => (
                            <li key={index}>{arg}</li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="defendant-arguments">
                    <AccordionTrigger>Defendant Arguments</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {analysis.arguments_and_reasoning.defendant_arguments.map(
                          (arg, index) => (
                            <li key={index}>{arg}</li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="court-reasoning">
                    <AccordionTrigger>Court&quot;s Reasoning</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                        {analysis.arguments_and_reasoning.court_reasoning.map(
                          (reason, index) => (
                            <li key={index}>{reason}</li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="implications">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Implications and Context</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">
                      Immediate Implications
                    </h3>
                    <ul className="list-disc pl-4 mb-4">
                      {analysis.implications_and_context.immediate_implications.map(
                        (implication, index) => (
                          <li key={index}>{implication}</li>
                        ),
                      )}
                    </ul>
                    <h3 className="font-semibold mb-2">Long Term Impacts</h3>
                    <ul className="list-disc pl-4 mb-4">
                      {analysis.implications_and_context.long_term_impacts.map(
                        (impact, index) => (
                          <li key={index}>{impact}</li>
                        ),
                      )}
                    </ul>
                    <h3 className="font-semibold mb-2">Broader Context</h3>
                    <p>{analysis.implications_and_context.broader_context}</p>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="outcomes">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentences and Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">Sentences</h3>
                    <ul className="list-disc pl-4 mb-4">
                      {analysis.sentences_and_awards.sentences.map(
                        (sentence, index) => (
                          <li key={index}>
                            <strong>{sentence.type}:</strong>{" "}
                            {sentence.duration}
                            {sentence.conditions.length > 0 && (
                              <ul className="list-circle pl-4 mt-2">
                                {sentence.conditions.map(
                                  (condition, condIndex) => (
                                    <li key={condIndex}>{condition}</li>
                                  ),
                                )}
                              </ul>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                    <h3 className="font-semibold mb-2">Awards</h3>
                    <ul className="list-disc pl-4 mb-4">
                      {analysis.sentences_and_awards.awards.map(
                        (award, index) => (
                          <li key={index}>
                            <strong>{award.type}:</strong> {award.amount}{" "}
                            {award.currency} to {award.recipient}
                          </li>
                        ),
                      )}
                    </ul>
                    <h3 className="font-semibold mb-2">Other Outcomes</h3>
                    <ul className="list-disc pl-4">
                      {analysis.sentences_and_awards.other_outcomes.map(
                        (outcome, index) => (
                          <li key={index}>
                            <strong>{outcome.type}:</strong>{" "}
                            {outcome.description}
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="legislation">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <Accordion type="single" collapsible className="w-full">
                  {analysis.legislation.legislations.map(
                    (legislation, index) => (
                      <AccordionItem key={index} value={`legislation-${index}`}>
                        <AccordionTrigger>{legislation.name}</AccordionTrigger>
                        <AccordionContent>
                          <p>
                            <strong>Sections Mentioned:</strong>{" "}
                            {legislation.sections_mentioned.join(", ")}
                          </p>
                          <p>
                            <strong>Relation to Case:</strong>{" "}
                            {legislation.relation_to_case}
                          </p>
                          <h4 className="font-semibold mt-2">Key Snippets:</h4>
                          <ul className="list-disc pl-4">
                            {legislation.key_snippets.map(
                              (snippet, snippetIndex) => (
                                <li key={snippetIndex}>{snippet}</li>
                              ),
                            )}
                          </ul>
                          <p>
                            <strong>Explanation:</strong>{" "}
                            {legislation.explanation}
                          </p>
                          <p>
                            <strong>Relevance:</strong> {legislation.relevance}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ),
                  )}
                </Accordion>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="key-persons">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <Accordion type="single" collapsible className="w-full">
                  {analysis.key_persons.persons.map((person, index) => (
                    <AccordionItem key={index} value={`person-${index}`}>
                      <AccordionTrigger>
                        {person.name} - {person.role}
                      </AccordionTrigger>
                      <AccordionContent>
                        <h4 className="font-semibold">Relationships:</h4>
                        <ul className="list-disc pl-4 mb-2">
                          {person.relationships.map((rel, relIndex) => (
                            <li key={relIndex}>
                              {rel.related_to}: {rel.relationship}
                            </li>
                          ))}
                        </ul>
                        <h4 className="font-semibold">
                          Significant Actions or Statements:
                        </h4>
                        <ul className="list-disc pl-4">
                          {person.significant_actions_or_statements.map(
                            (action, actionIndex) => (
                              <li key={actionIndex}>{action}</li>
                            ),
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}