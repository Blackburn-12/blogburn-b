import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

export default generateToken;
