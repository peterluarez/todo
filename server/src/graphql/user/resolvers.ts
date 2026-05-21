import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import "dotenv/config.js"

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export const userResolvers = {
  Mutation: { 
    register: async (
      _: any,
      { email, username, password }: { email: string; username: string; password: string }
    ) => {
      // 1. Check if email or username already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new Error("Email or Username is already registered");
      }

      // 2. Hash the raw password safely
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Create and save the new user to MongoDB
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });
      await newUser.save();

      // 4. Generate JWT
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        secretKey,
        { expiresIn: "1d" },
      );

      return { token, user: newUser };
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string },
    ) => { 
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }
 
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }
 
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey,
        { expiresIn: "1d" },
      );

      return { token, user };
    },
  },
};
