
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="p-4 flex justify-end items-center">
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
};