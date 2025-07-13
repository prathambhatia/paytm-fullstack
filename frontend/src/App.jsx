import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Dashboard } from './pages/Dashboard';
import AddMoney from './pages/AddMoney';
import SendMoney from './pages/SendMoney';
import TransactionHistory from './pages/TransactionHistory';

export default function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addmoney" element={<AddMoney />} />
          <Route path="/send/:userId" element={<SendMoney />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
