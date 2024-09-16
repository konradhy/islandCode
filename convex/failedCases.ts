import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveFailedCase = mutation({
  args: {
    caseNumber: v.string(),
    caseTitle: v.string(),
    year: v.number(),
    link: v.string(),
    errorMessage: v.string(),
    retryCount: v.number(),
    lastAttempt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("failedCases", args);
  },
});