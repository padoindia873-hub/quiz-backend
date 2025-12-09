import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import bcrypt from "bcryptjs";

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
router.post("/register1", async (req, res) => {
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

// router.post("/register", upload.single("profileImage"), async (req, res) => {
//   try {
//     const { email, password, userType, adminSecretCode } = req.body;

//     // Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     /* Admin validation */
//     if (userType === "ADMIN" && adminSecretCode !== "PADHO_INDIA_ADMIN_2025") {
//       return res.status(403).json({ message: "Invalid Admin Secret Code" });
//     }

//     /* Super Admin Validation */
//     if (
//       userType === "SUPER_ADMIN" &&
//       adminSecretCode !== "PADHO_INDIA_SUPER_ADMIN_2025"
//     ) {
//       return res.status(403).json({ message: "Invalid Super Admin Code" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       ...req.body,
//       password: hashedPassword,
//       profileImage: req.file ? req.file.filename : null,
//     });

//     await newUser.save();

//     return res.status(201).json({
//       message: "Registration successful",
//       user: newUser,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// });
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { email, password, userType, adminSecretCode } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    /* USER TYPE VALIDATION */
    let finalUserType = userType || "STUDENT"; // Default Student

    // Admin Validation
    if (
      finalUserType === "ADMIN" &&
      adminSecretCode !== "PADHO_INDIA_ADMIN_2025"
    ) {
      return res.status(403).json({ message: "Invalid Admin Secret Code" });
    }

    // Super Admin Validation
    if (
      finalUserType === "SUPER_ADMIN" &&
      adminSecretCode !== "PADHO_INDIA_SUPER_ADMIN_2025"
    ) {
      return res
        .status(403)
        .json({ message: "Invalid Super Admin Secret Code" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User Object
    const newUser = new User({
      ...req.body, // store all fields
      password: hashedPassword,
      userType: finalUserType,
      profileImage: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null,
    });

    // Save user
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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

// GET STUDENT DETAILS BY EMAIL
router.get("/student-by-email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find only STUDENT by email
    const student = await User.findOne({
      email: email.toLowerCase(),
      userType: "STUDENT",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found with this email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student data fetched successfully",
      data: student,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
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
    const students = await User.find({ userType: "STUDENT" }).select(
      "-password"
    );

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

// CHECK TRANSACTION BY ID
router.get("/transaction/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        message: "Transaction ID is required",
      });
    }

    const user = await User.findOne({ bankTransaction: transactionId }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "Invalid or No matching Transaction ID found",
      });
    }

    res.status(200).json({
      message: "Transaction Found",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// UPDATE BUYROLL BY TRANSACTION ID
router.put(
  "/update-buyRoll-by-transaction/:transactionId",
  async (req, res) => {
    try {
      let { transactionId } = req.params;
      const { buyRoll } = req.body;

      if (!transactionId)
        return res.status(400).json({ message: "Transaction ID is required" });
      if (buyRoll === undefined || buyRoll === null)
        return res.status(400).json({ message: "buyRoll value is required" });

      transactionId = transactionId.trim().toLowerCase();

      const updatedUser = await User.findOneAndUpdate(
        { bankTransaction: { $regex: new RegExp(`^${transactionId}$`, "i") } },
        { buyRoll: String(buyRoll) }, // convert to string so schema matches
        { new: true }
      ).select("-password");

      if (!updatedUser)
        return res
          .status(404)
          .json({ message: "No user found with this transaction ID" });

      res.status(200).json({
        message: "buyRoll updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.put("/update-start-buyroll/:transactionId", async (req, res) => {
  try {
    let { transactionId } = req.params;
    const { startTime, buyRoll } = req.body;

    if (!transactionId)
      return res.status(400).json({ message: "Transaction ID is required" });

    transactionId = transactionId.trim().toLowerCase();

    // Find user by Transaction ID
    const user = await User.findOne({
      bankTransaction: { $regex: new RegExp(`^${transactionId}$`, "i") },
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found with this transaction ID",
      });
    }

    // ---- Only update if fields are EMPTY ----
    if (!user.startTime || user.startTime.trim() === "") {
      if (startTime) user.startTime = startTime;
    }

    if (!user.buyRoll || user.buyRoll.trim() === "") {
      if (buyRoll) user.buyRoll = buyRoll.toString();
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "Fields updated successfully (only empty fields updated)",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
///
router.put("/update-start-time-end-time/:transactionId", async (req, res) => {
  try {
    let { transactionId } = req.params;
    const {
      startTime,
      endTime,
      rollActive,
      rollInactive,
      fistLevel,
      secLevel,
      thirdLevel,
    } = req.body;

    if (!transactionId)
      return res.status(400).json({ message: "Transaction ID is required" });

    transactionId = transactionId.trim().toLowerCase();

    // Find user by Transaction ID
    const user = await User.findOne({
      bankTransaction: { $regex: new RegExp(`^${transactionId}$`, "i") },
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found with this transaction ID",
      });
    }

    // ---- UPDATE ONLY IF CURRENT FIELD IS EMPTY ----
    const updateFieldIfEmpty = (fieldName, value) => {
      if ((!user[fieldName] || user[fieldName].trim() === "") && value) {
        user[fieldName] = value.toString();
      }
    };

    // updateFieldIfEmpty("startTime", startTime);
    updateFieldIfEmpty("endTime", endTime);
    updateFieldIfEmpty("rollActive", rollActive);
    updateFieldIfEmpty("rollInactive", rollInactive);
    updateFieldIfEmpty("fistLevel", fistLevel);
    updateFieldIfEmpty("secLevel", secLevel);
    updateFieldIfEmpty("thirdLevel", thirdLevel);

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "Fields updated successfully (only empty fields updated)",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.put("/update-user-after-exam/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;

    const {
      endTime,
      rollActive,
      academyMarks,
      gkMarks,
      fistLevel,
      secLevel,
      thirdLevel,
      rank,
      rollInactive,
      winnerDetails,
    } = req.body;

    //  Find user by bankTransaction
    const updatedUser = await User.findOneAndUpdate(
      { bankTransaction: transactionId },
      {
        $set: {
          endTime,
          rollActive,
          rollInactive,
          academyMarks,
          gkMarks,
          fistLevel,
          secLevel,
          thirdLevel,
          rank,
          winnerDetails,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this transaction ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully after exam",
      data: updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.post("/delete-transaction", async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId)
      return res.status(400).json({ message: "Transaction ID is required" });

    const updatedUser = await User.findOneAndUpdate(
      { bankTransaction: transactionId },
      {
        $unset: {
          bankTransaction: "",
          buyRoll: "",
          rollActive: "",
          rollInactive: ""
        }
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "No user found with this transaction ID" });

    return res.status(200).json({
      message: "Transaction removed successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// VERIFY PIN + DISTRICT + STATE API
router.post("/verify-pin-details", async (req, res) => {
  try {
    const { pin, district, state } = req.body;

    // Validate inputs
    if (!pin || !district || !state) {
      return res.status(400).json({
        message: "PIN, district, and state are required",
      });
    }

    if (pin.length !== 6) {
      return res.status(400).json({
        message: "PIN must be 6 digits",
      });
    }

    // Find user with all three fields matching
    const user = await User.findOne({
      pin,
      district: { $regex: new RegExp("^" + district + "$", "i") },
      state: { $regex: new RegExp("^" + state + "$", "i") },
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Invalid details. No matching record found",
      });
    }

    res.status(200).json({
      message: "Verification Successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// UPDATE NAME + BUYROLL API
router.post("/save-details", async (req, res) => {
  try {
    const { userId, name, buyRoll } = req.body;

    if (!userId || !name || !buyRoll) {
      return res.status(400).json({
        message: "userId, name and buyRoll are required",
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: name,
        buyRoll: buyRoll,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Details saved successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// CHECK NAME + BUYROLL (NO UPDATE)
router.post("/check-details", async (req, res) => {
  try {
    const { name, buyRoll } = req.body;

    // Validate fields
    if (!name || buyRoll === undefined || buyRoll === null) {
      return res.status(400).json({
        status: false,
        message: "name and buyRoll are required",
      });
    }

    // FIND USER IN DATABASE (STUDENT)
    const student = await User.findOne({
      userType: "STUDENT",
      firstName: name,        // or fullName depending on your DB
      buyRoll: buyRoll
    });

    // If not found in database
    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Name or Roll Number does not match any student.",
      });
    }

    // If found → success
    return res.status(200).json({
      status: true,
      message: "Student found.",
      data: student
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
});




router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ userType: "STUDENT" }); // Filter only students

    return res.status(200).json({
      success: true,
      total: students.length,
      students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message,
    });
  }
});

export default router;
