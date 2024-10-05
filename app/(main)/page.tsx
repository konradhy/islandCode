"use client"
import React from "react";
import { Content } from "@/components/home/content";
import { Search } from "@/components/search/search";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Content />
      <Search />
    </div>
  );
};

export default LandingPage;
