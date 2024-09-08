import React from 'react';
import { Header } from "@/components/shared/header"
import { Content } from '@/components/home/content';
import { Footer } from '@/components/shared/footer';
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default LandingPage;