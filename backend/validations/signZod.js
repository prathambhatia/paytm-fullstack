const { z } = require('zod');

// Base schema for all users
const baseUserSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().max(50),
  lastName: z.string().max(50)
});

// Signup Schema = all fields required (use full schema)
const signupSchema = baseUserSchema;

// Signin Schema = only username + password
const signinSchema = baseUserSchema.pick({
  username: true,
  password: true
});

// Update Schema = only allow firstName/lastName/password edits
const updateBody = baseUserSchema.pick({
  firstName: true,
  lastName: true,
  password: true
}).partial(); // optional for PATCH-style


module.exports = {
  signupSchema,
  signinSchema,
  updateBody,
};
