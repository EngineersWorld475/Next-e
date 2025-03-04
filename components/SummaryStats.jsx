import React from "react";

const SummaryStats = () => {
  return (
    <div className="w-full bg-[#FCE8BD] grid grid-cols-2 md:grid-cols-4 gap-4 p-6 text-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">727</h1>
        <span className="text-gray-600">Users</span>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">48</h1>
        <span className="text-gray-600">Groups</span>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">228</h1>
        <span className="text-gray-600">Articles</span>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">432</h1>
        <span className="text-gray-600">Annotations</span>
      </div>
    </div>
  );
};

export default SummaryStats;
