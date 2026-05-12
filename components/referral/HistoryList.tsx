import React from "react";

interface HistoryItem {
  time: string;
  status: string;
  source: string;
  reward: string;
}

const history: HistoryItem[] = [
  { time: "2024-08-19", status: "3/5", source: "Task", reward: "0.25 PCM" },
  { time: "2024-12-20", status: "5/5", source: "Task", reward: "0.25 PCM" },
];

const HistoryList: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-300 mb-4">History</h3>
      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <p className="text-sm text-gray-600">{item.time}</p>
            <p className="text-sm text-gray-600">{item.status}</p>
            <p className="text-sm text-gray-600">{item.source}</p>
            <p className="text-sm font-medium text-gray-800">{item.reward}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;

