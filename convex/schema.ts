import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cases: defineTable({
    caseNumber: v.string(),
    caseTitle: v.string(),
    dateOfDelivery: v.string(),
    presidingJudge: v.string(),
    neutralCitation: v.string(),
    year: v.number(),
    pdfFileName: v.string(),
    storageId: v.id("_storage"),
    fileSize: v.number(),
    keywordsSummary: v.string(),
    jurisdiction: v.string(),
    court: v.string(),
    searchSummary: v.string(),
    searchableText: v.string(),
 }).searchIndex("search_cases", {
    searchField: "searchableText",
    filterFields: ["jurisdiction", "court", "year"]
  }),

   failedCases: defineTable({
    caseNumber: v.string(),
    caseTitle: v.string(),
    year: v.number(),
    link: v.string(),
    errorMessage: v.string(),
    retryCount: v.number(),
    lastAttempt: v.number(), // Unix timestamp
  }).index("by_year", ["year"])
});