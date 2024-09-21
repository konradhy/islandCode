import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getCaseById = query({
  args: { id: v.id("cases") },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.id);
    if (!caseDoc) {
      throw new Error("Case not found");
    }

    const pdfUrl = await ctx.storage.getUrl(caseDoc.storageId);

    return {
      ...caseDoc,
      pdfUrl,
    };
  },
});

export const saveCase = mutation({
  args: {
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
    searchableText: v.string(),
  },
  handler: async (ctx, args) => {
    const searchSummary = `${args.caseTitle} ${args.keywordsSummary}`;
    await ctx.db.insert("cases", { ...args, searchSummary });
  },
});

export const getCases = query({
  args: {
    searchTerm: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
    filters: v.optional(
      v.object({
        jurisdictions: v.array(v.string()),
        yearRange: v.array(v.number()),
        courts: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { searchTerm, jurisdiction, paginationOpts } = args;

    let paginatedResults;

    if (searchTerm && searchTerm.trim() !== "") {
      // Use search index when there's a non-empty search term
      paginatedResults = await ctx.db
        .query("cases")
        .withSearchIndex("search_cases", (q) => {
          let query = q.search("searchableText", searchTerm);
          if (jurisdiction) {
            query = query.eq("jurisdiction", jurisdiction);
          }
          return query;
        })
        .paginate(paginationOpts);
    } else {
      // Return latest cases when there's no search term
      let query = ctx.db.query("cases").order("desc");

      if (jurisdiction) {
        query = query.filter((q) =>
          q.eq(q.field("jurisdiction"), jurisdiction),
        );
      }

      paginatedResults = await query.paginate(paginationOpts);
    }

    return {
      ...paginatedResults,
      page: paginatedResults.page.map((caseItem) => ({
        id: caseItem._id,
        title: caseItem.caseTitle,
        citation: caseItem.neutralCitation,
        jurisdiction: caseItem.jurisdiction,
        docType: "Case",
        snippet: caseItem.keywordsSummary,
      })),
    };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const uploadPdf = action({
  args: { pdfData: v.string(), fileName: v.string() },
  handler: async (ctx, args) => {
    const buffer = Buffer.from(args.pdfData, "base64");
    const blob = new Blob([buffer]);
    const storageId = await ctx.storage.store(blob);
    return { storageId };
  },
});
