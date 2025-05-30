import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  role,
}) => {
  if (await User.findOne({ email })) throw new Error("Email already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role: role || "user",
  });
  await user.save();
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "1h",
  });
  if (!token) throw new Error("Token generation failed");
  user.password = undefined;
  return { user, token };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  }).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

export const disableUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!user) throw new Error("User not found");
  return user;
};

export const listUsers = async (filters = {}) => {
  const filter = {};
  const { firstName, lastName, email, phone, role, isActive } = filters;
  if (firstName) filter.firstName = firstName;
  if (lastName) filter.lastName = lastName;
  if (email) filter.email = email;
  if (phone) filter.phone = phone;
  if (role) filter.role = role;
  if (typeof isActive === "boolean") filter.isActive = isActive;

  return User.find(filter).select("-password");
};
