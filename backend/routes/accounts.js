const express = require('express');
const router = express.Router();

const { authMiddleware, generateToken } = require('../middlewares/auth');

const mongoose = require('mongoose');
const { User, Account, Transaction } = require('../db');

router.post('/transfer', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { to, amount } = req.body;

    console.log("Transfer to userId:", to, "Amount:", amount);

    if (!to || !amount || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid transfer details' });
    }

    // 1. Find sender's account
    const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (!senderAccount || senderAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 2. Find receiver's account directly using userId
    const receiverAccount = await Account.findOne({ userId: to }).session(session);
    if (!receiverAccount) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Recipient account not found' });
    }

    // 3. Update balances
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    await senderAccount.save({ session });
    await receiverAccount.save({ session });

    // 4. Save transaction record
    await Transaction.create([{
      from: req.userId,
      to: to,
      amount,
      timestamp: new Date()
    }], { session });

    await session.commitTransaction();
    res.status(200).json({ message: 'Transfer successful' });

  } catch (error) {
    await session.abortTransaction();
    console.error("Transfer error:", error);
    res.status(500).json({ message: 'Transfer failed', error: error.message });
  } finally {
    session.endSession();
    console.log('Transfer route completed');
  }
});



router.post("/addfunds", authMiddleware, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const account = await Account.findOne({ userId: req.userId });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  account.balance += amount;
  await account.save();

  res.json({ message: "Funds added", newBalance: account.balance });
});

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId }); //to findd one user

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    return res.json({ balance: account.balance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  const currentUser = req.userId;

  const transactions = await Transaction.find({
    $or: [{ from: currentUser }, { to: currentUser }]
  })
    .populate('from', 'firstName lastName')
    .populate('to', 'firstName lastName')
    .sort({ timestamp: -1 }); // 

  // ✅ formatDate helper
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month} ${year}`;
  };

  const exchange = transactions.map(tx => {
  const fromName = `${tx.from.firstName} ${tx.from.lastName}`;
  const toName = `${tx.to.firstName} ${tx.to.lastName}`;
  const amount = tx.amount;
  const formattedDate = formatDate(tx.timestamp);

  if (tx.from._id.toString() === currentUser.toString()) {
    return {
      type: "sent",
      name: toName,
      amount: -amount,
      date: formattedDate
    };
  } else if (tx.to._id.toString() === currentUser.toString()) {
    return {
      type: "received",
      name: fromName,
      amount: amount,
      date: formattedDate
    };
  } else {
    return null;
  }
}).filter(Boolean);


  return res.json({ exchange });
});



module.exports = router;
