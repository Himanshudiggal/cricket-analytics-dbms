// backend/rehash.js
import bcrypt from "bcryptjs";

const run = async () => {
  const plain = "Admin@123";
  const hash = await bcrypt.hash(plain, 10);
  console.log("New hash for", plain, "=>");
  console.log(hash);
};
run();
