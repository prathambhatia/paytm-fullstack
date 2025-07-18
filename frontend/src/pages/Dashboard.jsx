import { Link } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect } from "react";
import { useBalance } from "../hooks/useBalance";
import Transaction from "../components/Transaction";

export const Dashboard = () => {
  const firstName = localStorage.getItem("firstName") || "Pratham";

  const { balance, fetchBalance } = useBalance(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <>
      <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-40">
        <AppBar text="Payments App" firstName={firstName}></AppBar>
        <div className="flex flex-col lg:flex-row gap-4">
          <Balance balance={balance ?? "Loading..."} />
          <Transaction />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <Link to="/addmoney">
            <button className="btn-green w-full sm:w-auto">
              Add funds
            </button>
          </Link>
          <Link to="/transactions">
            <button className="btn-blue w-full sm:w-auto">
              History
            </button>
          </Link>
        </div>
        <Users />
      </div>
    </>
  );
};
