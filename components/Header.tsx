import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-teal-600 text-white shadow-lg">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl md:text-4xl font-amiri font-bold">الدورية الشهرية للأسرة</h1>
        <p className="text-teal-100 mt-1">نسأل الله أن يديم جمعنا على خير</p>
      </div>
    </header>
  );
};