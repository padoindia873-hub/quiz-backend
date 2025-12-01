import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const ADMIN_SECRET_CODE = "PADHO_INDIA_ADMIN_2025";
const SUPER_ADMIN_SECRET_CODE = "PADHO_INDIA_SUPER_ADMIN_2025";

/* -------------------------------------
   REGISTER USER (Student/Admin/SuperAdmin)
-------------------------------------- */
// router.post("/register", async (req, res) => {
//   try {
//     const { email, password, userType } = req.body;

//     // Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Role Validation
//     if (userType === "ADMIN" || userType === "SUPER_ADMIN") {
//       const token = req.headers.authorization?.split(" ")[1];

//       if (!token) {
//         return res.status(401).json({
//           message: "Only SUPER_ADMIN can create ADMIN or SUPER_ADMIN accounts",
//         });
//       }

//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET || "secret123"
//       );

//       if (decoded.userType !== "SUPER_ADMIN") {
//         return res.status(403).json({
//           message: "You are not authorized to create admin or super admin accounts",
//         });
//       }
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = new User({
//       ...req.body,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "Registration Successful",
//       userType: newUser.userType,
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

/* -------------------------------------
   REGISTER USER (Student/Admin/SuperAdmin)
-------------------------------------- */
/* -------------------------------------
   REGISTER USER (Student/Admin/SuperAdmin)
-------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { email, password, userType, adminSecretCode } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    /* ---------------------------------------------------
         STUDENT → Always allowed
    --------------------------------------------------- */
    if (userType === "STUDENT") {
      // allowed without secret code
    }

    /* ---------------------------------------------------
         ADMIN → requires ADMIN SECRET CODE
    --------------------------------------------------- */
    if (userType === "ADMIN") {
      if (adminSecretCode !== ADMIN_SECRET_CODE) {
        return res.status(401).json({
          message: "Invalid ADMIN Secret Code",
        });
      }
    }

    /* ---------------------------------------------------
         SUPER ADMIN → requires SUPER ADMIN SECRET CODE
    --------------------------------------------------- */
    if (userType === "SUPER_ADMIN") {
      if (adminSecretCode !== SUPER_ADMIN_SECRET_CODE) {
        return res.status(401).json({
          message: "Invalid SUPER ADMIN Secret Code",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: `${userType} Registration Successful`,
      userType: newUser.userType,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


/* ----------------------------
   USER LOGIN
---------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const userData = user.toObject();
    delete userData.password;

    // 5️ Send response (frontend expects token + user)
    res.status(200).json({
      message: "Login Successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ----------------------------
   USER PROFILE (Protected)
---------------------------- */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ----------------------------
   FIND USER BY EMAIL OR PHONE
---------------------------- */
router.post("/find-user", async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        message: "Please provide email or phone number",
      });
    }

    let query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const user = await User.findOne(query).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "No user found with given details",
      });
    }

    res.status(200).json({
      message: "User Found",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/users", async (req, res) => {
  try {
    const students = await User.find({ userType: "STUDENT" }).select("-password");

    res.status(200).json({
      message: "Student Users Fetched Successfully",
      count: students.length,
      users: students,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update Bank Transaction (No Auth)
router.put("/users/:id/bank-transaction", async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        message: "Transaction ID is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bankTransaction: transactionId },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Bank Transaction Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default router;
