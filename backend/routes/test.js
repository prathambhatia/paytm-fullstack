const bcrypt = require("bcryptjs");

// Replace with actual plain password and hashed password from MongoDB:
const plainPassword = "123456";
const hashedPassword = "$2b$10$nFkUWzBWaCT.dLXote/Owes6vhihg/w6.gxs3OWDKGjTEfqBt7ssK";

bcrypt.compare(plainPassword, hashedPassword).then((match) => {
  console.log("Password match result:", match);
});
