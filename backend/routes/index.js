const express = require("express");
const router = express.Router();

const userRouter = require('./user');
const accountRouter = require('./accounts');

// console.log("🕵️‍♀️ userRouter:", typeof userRouter, userRouter?.stack ? '✔ router' : userRouter);
// console.log("🕵️‍♀️ accountRouter:", typeof accountRouter, accountRouter?.stack ? '✔ router' : accountRouter);

router.use('/user', userRouter);
router.use('/account', accountRouter);

router.get('/health', (req, res) => {
  res.json({ message: "API is healthy!" });
});

module.exports = router;
