"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FilterOptions from "./filter-options";
import { LegalDocument } from "./legal-document";
import { Case } from "@/types/cases";
import { Filters } from "@/types/cases";

export const Results = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    jurisdictions: [],
    yearRange: [1961, 2024],
    courts: [],
  });
  const [results, setResults] = useState<Case[]>([]); // Explicitly type and initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const initialSearchTerm = searchParams.get("search") || "";
    setSearchTerm(initialSearchTerm);
    fetchCases(initialSearchTerm, filters, 1);
  }, [searchParams, filters]);

  useEffect(() => {
    console.log("Updated results:", results);
  }, [results]);

  const fetchCases = async (
    search: string,
    filters: Filters,
    pageNum: number,
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm: search, filters, page: pageNum }),
      });
      const data = await response.json();
      console.log("Received data:", data); // Add this line
      if (pageNum === 1) {
        setResults(data.cases);
      } else {
        setResults((prev) => [...prev, ...data.cases]);
      }
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?search=${encodeURIComponent(searchTerm)}`);
    fetchCases(searchTerm, filters, 1);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    fetchCases(searchTerm, newFilters, 1);
  };

  const loadMore = () => {
    fetchCases(searchTerm, filters, page + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-2xl font-bold mr-8">
            IslandCode
          </Link>
          <form onSubmit={handleSearch} className="flex-grow flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cases..."
              className="w-full rounded-l-full border border-r-0 px-4 py-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-r-full flex items-center"
            >
              <Search className="w-5 h-5" />
              <span className="ml-2">Search</span>
            </button>
          </form>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-1/4">
            <FilterOptions onFilterChange={handleFilterChange} />
          </aside>
          <div className="w-3/4">
            <p className="text-sm text-gray-600 mb-4">
              {loading
                ? "Loading results..."
                : `Showing ${results?.length || 0} results`}
            </p>
            <div className="space-y-4">
              {results && results.length > 0 ? (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/cases/${result.id}`}
                    className="block"
                  >
                    <LegalDocument case={result} />
                  </Link>
                ))
              ) : (
                <p>No cases found.</p>
              )}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
