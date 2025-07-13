import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar } from '../components/AppBar';
import Avatar from '../components/Avatar';

const TransactionHistory = () => {
  const firstName = localStorage.getItem("firstName") || "Pratham";
  const [exchange, setExchange] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3000/api/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Add running balance
        let balance = 0;
        const enriched = response.data.exchange.map(tx => {
          balance += tx.amount;
          return { ...tx, balance };
        });

        setExchange(enriched);
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
      }
    };

    fetchData();
  }, []);

  // Filter by search and type
  const filteredExchange = exchange
    .filter(tx =>
      tx.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tx =>
      typeFilter === "all" ? true : tx.type === typeFilter
    );

  // Group by date
  const groupByDate = (txList) => {
    return txList.reduce((acc, tx) => {
      if (!acc[tx.date]) acc[tx.date] = [];
      acc[tx.date].push(tx);
      return acc;
    }, {});
  };

  const grouped = groupByDate(filteredExchange);

  // Monthly summary
  const totals = exchange.reduce((acc, tx) => {
    if (tx.type === "sent") acc.sent += Math.abs(tx.amount);
    else acc.received += tx.amount;
    return acc;
  }, { sent: 0, received: 0 });

  const net = totals.received - totals.sent;

  return (
    <div className="min-h-screen mx-40 bg-[#1E1E1E]">
      <AppBar text="Transactions History" firstName={firstName} />

      <div className="p-4 mt-4">
        {/* Monthly Summary */}
        <div className="bg-[#1E1E1E] shadow p-4 rounded-lg mb-6 text-sm">
          <p>Total Sent: <span className="text-[#E0E0E0] font-bold">₹{totals.sent}</span></p>
          <p>Total Received: <span className="text-[#E0E0E0] font-bold">₹{totals.received}</span></p>
          <p>Net: <span className={`font-bold ${net < 0 ? 'text-[#E0E0E0]' : 'text-[#E0E0E0]'}`}>₹{net}</span></p>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name"
          className="w-full px-3 py-2 bg-[#1E1E1E] text-[#E0E0E0] border border-gray-600 rounded-md placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Type Filter Buttons */}
        <div className="flex gap-4 mb-4">
          {["all", "sent", "received"].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-1 rounded-full border transition-all duration-200 ${
                typeFilter === type
                  ? "btn text-white"
                  : "bg-[#1E1E1E] text-[#E0E0E0] hover:btn"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions Grouped by Date */}
        {Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <h2 className="text-md font-semibold my-2 text-[#E0E0E0]">{date}</h2>
            {txs.map((tx, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#1E1E1E] shadow-md p-4 rounded-lg mb-3"
              >
                <div className="flex items-center">
                  <Avatar name={tx.name} />
                  <div className="ml-4">
                    <div className="font-semibold">{tx.name}</div>
                    <div className="text-sm text-[#E0E0E0]">
                      {tx.type === "sent" ? "You sent to" : "You received from"}{" "}
                      <span className="font-medium">{tx.name}</span>
                    </div>
                    <div className="text-xs text-[#E0E0E0]">
                      Balance after: ₹{tx.balance}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-lg font-bold ${
                    tx.type === "sent" ? "text-[#E0E0E0]" : "text-[#E0E0E0]"
                  }`}
                >
                  ₹{Math.abs(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
