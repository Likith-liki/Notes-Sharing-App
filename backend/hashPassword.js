import bcrypt from "bcryptjs";

const password = "admin"; // the password you want to hash

const generateHash = async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("Hashed password:", hash);
};

generateHash();
