import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Invoice", value: 4000 },
  { name: "Collection", value: 3000 },
  { name: "Collected", value: 2000 },
  { name: "Discounted", value: 2780 },
  { name: "Receivable", value: 1890 },
];

const FinancialSummary = () => {
  return (
    <div
      className="p-6 mt-8 mb-8 rounded-lg shadow-xl bg-white text-white"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex flex-wrap gap-3">
            {data.map((item) => (
              <div
                key={item.name}
                className="p-4 flex-1 min-w-[120px] text-center rounded-lg shadow-md"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <h6 className="font-bold text-lg mb-2">{item.name}</h6>
                <h5 className="text-xl">${item.value.toLocaleString()}</h5>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[300px]">
          <BarChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
