import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PopulationData {
  continent: string;
  population: number;
}

interface BarChartProps {
  data: PopulationData[];
  toolCallId: string;
}

export function BarChart({ data, toolCallId }: BarChartProps) {
  return (
    <div
      key={toolCallId}
      className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Continental Population Distribution
      </h3>
      <RechartsBarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="continent" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="population" fill="#8884d8" />
      </RechartsBarChart>
    </div>
  );
}
