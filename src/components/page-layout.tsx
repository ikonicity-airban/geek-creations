"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <div className={`max-w-[1024px] mx-auto px-8 md:px-12 ${className}`}>
      {children}
    </div>
  );
};

