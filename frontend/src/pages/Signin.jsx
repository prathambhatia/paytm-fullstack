import { useState } from "react";
import { Heading, SubHeading } from "../components/Heading"
import { InputBox } from "../components/InputBox";
import { ButtonWarning } from "../components/ButtonWarning";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignin = async(e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/v1/user/signin", {
                username,
                password
            });
            const { token , firstName, balance } = await res.data;
            //storing in local memory
            localStorage.setItem("token", token);
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("balance", balance);

            navigate("/dashboard");
        } catch(err) {
            const message = err.repsonse?.data?.message || "Signin failed."
            alert(message);
        }
        
    }
    return (
        <>
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1E1E1E]">
                <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-80 text-center">
                    <Heading title="Sign In" />
                    <SubHeading title="Enter your credentials to access your account." />
                    <InputBox 
                    label="Email" 
                    type="email" placeholder= "your@example.com"
                    value = {username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputBox 
                    label="Password" 
                    type="password" placeholder= ""
                    value = {password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button title="Sign in" onClick={handleSignin} bgColor="bg-black" textColor="text-white" />
                    <ButtonWarning>
                        Don't have an account? <Link to="/signup" className="underline cursor-pointer">Sign up</Link>
                    </ButtonWarning>
                </div>
            </div>
        </>
    )
    
}

