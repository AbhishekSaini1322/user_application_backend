const User = require("../models/userData"); 

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

async function generateUsername() {
  let username;
  let isUnique = false;

  while (!isUnique) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit
    username = `user${randomNumber}`;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return username;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  generateUsername
};
