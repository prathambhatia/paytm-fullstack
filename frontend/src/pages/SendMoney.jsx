import { useState } from "react";
import Avatar from "../components/Avatar";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import axios from "axios";
import { useBalance } from "../hooks/useBalance";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";

const SendMoney = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const { firstName, lastName } = state;

  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const { fetchBalance } = useBalance();
  const navigate = useNavigate();

  const handleSendMoney = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/v1/account/transfer",
        { to: userId, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchBalance();

      // ✅ Store last interacted user simply — used only for sorting in frontend
      localStorage.setItem(
        "lastInteractedUser",
        JSON.stringify({ _id: userId, firstName, lastName })
      );

      alert("Funds transferred successfully!");
      setAmount("");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to transfer funds.";
      alert(message);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#1E1E1E]">
      <div className="fixed top-6 right-8 w-30">
        <Link to="/dashboard">
          <Button title="Dashboard" bgColor="btn" textColor="text-white" />
        </Link>
      </div>

      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-80 text-center">
        <Heading title="Send Money" />
        <div className="pt-5 flex gap-3 mb-5">
          <Avatar name={firstName} />
          <span className="font-bold mt-1">
            {firstName} {lastName}
          </span>
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
            onClick={handleSendMoney}
            title="Send Amount"
            bgColor="btn"
            textColor="text-white"
          />
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message={`Are you sure you want to transfer ₹${amount} to ${firstName} ${lastName}?`}
          onConfirm={confirmSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default SendMoney;
