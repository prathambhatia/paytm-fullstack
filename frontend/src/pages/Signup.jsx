import { useState } from 'react';
import { Heading, SubHeading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { ButtonWarning } from '../components/ButtonWarning';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password,setPassword] = useState("");
  const naviagate = useNavigate();

  const handleSignup = async(e) => {
    e.preventDefault();

    try {
        await axios.post("http://localhost:3000/api/v1/user/signup", {
        username,
        password,
        firstName,
        lastName
    });

      alert("Signup successful! Please log in.");
      naviagate("/signin");
    }
    catch(err) {
      const message = err.response?.data?.error || "Signup failed.";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1E1E1E]">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-80 text-center">
        <Heading title="Sign Up" />
        <SubHeading title="Enter your information to create an account." />
        <div className='mt-4'>
          <InputBox 
            label="First Name" 
            type="text" placeholder= "Enter your first name"
            value = {firstName} onChange={(e) => setFirstName(e.target.value)}
          />
          <InputBox 
            label="Last Name" 
            type="text" placeholder= "Enter your last name"
            value = {lastName} onChange={(e) => setLastName(e.target.value)}
          />
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
          <Button title="Sign up" onClick={handleSignup} bgColor="bg-black" textColor="text-white" />
          <ButtonWarning>
            Already have an account? <Link to="/signin" className="underline cursor-pointer">Login</Link>
          </ButtonWarning>
        </div>
      </div>
  </div>
  );
}
