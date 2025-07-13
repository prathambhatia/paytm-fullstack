const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { authMiddleware, generateToken } = require('../middlewares/auth');

const { signupSchema, signinSchema, updateBody, transactionSchema } = require('../validations/signZod');
console.log("🧪 signupSchema loaded from signZod:", signupSchema);

const { User, Account, Transaction } = require('../db');


// ─── Debug Logger (optional) ─────────────────────────────────
console.log('👤 routes/user.js loaded');
console.log("🧪 generateToken is:", typeof generateToken);


// ─── Dummy Test Route ────────────────────────────────────────
router.get('/test', (req, res) => {
  return res.json({ message: 'User test route OK' });
});

// ─── Signup Route ────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    // 1. Validate request body using Zod
    const data = signupSchema.parse(req.body);
    const { username, password, firstName, lastName } = data;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // 3. Hash the password
    const hash = await bcrypt.hash(password, 10);

    // 4. Create user in the DB
    const newUser = await User.create({
      username,
      password: hash,
      firstName,
      lastName
    });

    // 5. Create account for user with 0 balance
        try {
        const account = await Account.create({
            userId: newUser._id,
            balance: 1 + Math.random() * 10000
        });
        console.log("✅ Account created:", account);
        } catch (err) {
        console.error("❌ Failed to create account:", err);
        }


    // 6. Generate JWT token
    const token = generateToken(newUser._id);

    // 7. Send response
    return res.status(201).json({
      message: 'User created successfully',
      token
    });

  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ errors: err.errors });
    }

    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// ─── Signin Route ────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const data = signinSchema.parse(req.body);
    const { username, password } = data;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const account = await Account.findOne({ userId: existingUser._id });


    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const firstName = existingUser.firstName;
    const balance = account.balance;

    const token = generateToken(existingUser._id);
    
    return res.status(200).json({
      message: 'Signed in successfully',
      token,
      userId: existingUser._id,  // ADD THIS LINE
      firstName,
      balance
    });

  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ errors: err.errors });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Bulk Search Route ───────────────────────────────────────
router.get('/bulk', authMiddleware, async (req, res) => {
  const filter = req.query.filter || '';
  const currentUserId = req.userId;

  const users = await User.find({
    $and: [
      {
        $or: [
          { firstName: { $regex: filter, $options: 'i' } },
          { lastName:  { $regex: filter, $options: 'i' } }
        ]
      },
      { _id: { $ne: currentUserId } }
    ]
  });

  return res.json({ userList: users });
});


// ─── Recent users Route ───────────────────────────────────────
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.userId;

    const transactions = await Transaction.find({
      $or: [{ from: currentUserId }, { to: currentUserId }]
    }).sort({ timestamp: -1 });

    const interactedIds = [...new Set(
      transactions.map(tx =>
        tx.from.toString() === currentUserId.toString()
          ? tx.to.toString()
          : tx.from.toString()
      )
    )].filter(id => id !== currentUserId);

    let recentUsers = await User.find({
      _id: { $in: interactedIds }
    });

    if (recentUsers.length < 10) {
      const fillerUsers = await User.find({
        _id: { $nin: [currentUserId, ...interactedIds] }
      }).limit(10 - recentUsers.length);

      recentUsers = [...recentUsers, ...fillerUsers];
    }

    return res.json(recentUsers);
  } catch (err) {
    console.error("Error fetching recent users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// ─── Update Profile Route ──────────────────────────────────────
router.put('/', authMiddleware, async (req, res) => {
  const { success, error } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: 'Invalid input', errors: error.errors });
  }

  try {
    await User.updateOne({ _id: req.userId }, { $set: req.body });
    return res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
