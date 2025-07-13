import { useState } from "react";
import Avatar from "../components/Avatar";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import axios from "axios";
import { useBalance } from "../hooks/useBalance";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";

const AddMoney = () => {
  const firstName = localStorage.getItem("firstName") || "Pratham";
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { fetchBalance } = useBalance();
  const navigate = useNavigate();

  const handleAddMoney = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmAdd = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/v1/account/addfunds",
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBalance();
      alert("Funds added successfully!");
      setAmount("");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.error || "Failed to add funds.";
      alert(message);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#1E1E1E]">

      <div className="fixed top-6 right-8 w-30">
        <Link to="/dashboard">
          <Button 
            title="Dashboard"
            bgColor="btn"
            textColor="text-white"
          />
        </Link>
      </div>


      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-80 text-center">
        <Heading title="Add Money" />
        <div className="pt-5 flex gap-3 mb-5">
          <Avatar name={firstName} />
          <span className="font-bold mt-1">{firstName}'s Account</span>
        </div>
        <InputBox
          label="Amount (in Rs)"
          type="number"
          value={amount}
          placeholder="0"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="pt-2">
          <Button
            onClick={handleAddMoney}
            title="Add Balance"
            bgColor="btn"
            textColor="text-white"
          />
        </div>

      </div>

      {showConfirm && (
        <ConfirmModal
          message={`Are you sure you want to add ₹${amount} to your account?`}
          onConfirm={confirmAdd}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default AddMoney;

