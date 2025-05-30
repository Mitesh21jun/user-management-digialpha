import * as userService from "../services/userService.js";
import { auth, authorize } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    await userService.registerUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.put("/users/:id", auth, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.delete("/users/:id", auth, authorize(["admin"]), async (req, res) => {
  try {
    await userService.disableUser(req.params.id);
    res.json({ message: "User disabled" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get("/users", auth, authorize(["admin"]), async (req, res) => {
  try {
    const users = await userService.listUsers(req.query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
