import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], weight: ["300", "500", "600"] });

const SummaryStats = () => {
  return (
    <div className="w-full bg-white grid grid-cols-2 md:grid-cols-4 gap-4 p-6 text-center text-gray-800">
      <div className={`${inter.className} bg-white p-4 rounded-lg shadow-md`}>
        <h1 className="text-2xl font-bold">727</h1>
        <span className="text-gray-600">Users</span>
      </div>
      <div className={`${inter.className} bg-white p-4 rounded-lg shadow-md`}>
        <h1 className="text-2xl font-bold">48</h1>
        <span className="text-gray-600">Groups</span>
      </div>
      <div className={`${inter.className} bg-white p-4 rounded-lg shadow-md`}>
        <h1 className="text-2xl font-bold">228</h1>
        <span className="text-gray-600">Articles</span>
      </div>
      <div className={`${inter.className} bg-white p-4 rounded-lg shadow-md`}>
        <h1 className="text-2xl font-bold">432</h1>
        <span className="text-gray-600">Annotations</span>
      </div>
    </div>
  );
};

export default SummaryStats;
