"use client";
import React from 'react';
import GoogleCalendar from '@/components/calendar';

const Page: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <GoogleCalendar />
    </div>
  );
};

export default Page;

