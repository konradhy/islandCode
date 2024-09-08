import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { LegalDocument } from './legal-document';
import { mockResults } from './mock-results';

export const Results = () => {
    return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold mr-8">IslandCode</h1>
          <div className="relative flex-grow">
            <Input 
              type="text" 
              defaultValue="freedom of expression Caribbean"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="ml-4">Search</Button>
        </div>

        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-600">About 150 results (0.32 seconds)</p>
        </div>

        <div>
          {mockResults.map((result, index) => (
            <LegalDocument key={index} {...result} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <Button variant="outline" className="rounded-l-md">Previous</Button>
            <Button variant="outline" className="rounded-r-md ml-2">Next</Button>
          </nav>
        </div>
      </main>
    </div>
  );
};

