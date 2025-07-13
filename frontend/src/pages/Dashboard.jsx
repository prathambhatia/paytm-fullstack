import { Link, useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import { useBalance } from "../hooks/useBalance";
import Transaction from "../components/Transaction";

export const Dashboard = () => {
  const firstName = localStorage.getItem("firstName") || "Pratham";
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();

  const { balance, fetchBalance } = useBalance(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthPopup(true);
    } else {
      fetchBalance();
    }
  }, []);

  if (showAuthPopup) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#1E1E1E]">
        <div className="bg-[#2C2C2C] text-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-4">Please sign in to access the dashboard</h2>
          <button
            onClick={() => navigate("/signin")}
            className="btn px-6 py-2 mt-2 text-white hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-40">
      <AppBar text="Payments App" firstName={firstName} />
      <div className="flex flex-col lg:flex-row gap-4">
        <Balance balance={balance ?? "Loading..."} />
        <Transaction />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
        <Link to="/addmoney">
          <button className="btn-green w-full sm:w-auto">Add funds</button>
        </Link>
        <Link to="/transactions">
          <button className="btn-blue w-full sm:w-auto">History</button>
        </Link>
      </div>

      <Users />
    </div>
  );
};
