import axios from "axios";
import { useState } from "react";

export const useBalance = () => {
    const[balance,setBalance] = useState(null);

    const fetchBalance = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/account/balance", {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        setBalance(res.data.balance);
        localStorage.setItem("balance", res.data.balance);
    } catch (err) {
        console.error("Failed to fetch balance:", err);
    }
    };

    return { balance, fetchBalance };
}
