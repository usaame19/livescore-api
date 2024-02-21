import prisma from "../../../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_Secret } from "../../config/config.js";
import { generateCode } from "../../util/generations.js";
import sendCodeEmail from "../../util/emails/SendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (userExists) {
      return res
        .status(400)
        .send({ status: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        resetToken: null, 
        resetTokenExpiry: null,
      },
    });

    // Remove password from the result
    delete user.password;

    res.status(201).send({ status: true, message: user });
  } catch (error) {
    console.error("Error at user registration", error);
    res.status(500).send({ status: false, message: "Unknown error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid username or password" });
    }

    const token = jwt.sign({ email: user.email }, JWT_Secret);

    delete user.password;

    res.status(200).send({ status: "success", data: token });
  } catch (error) {
    console.error("Error at login", error);
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user._id },
      select: {
        id: true,
        username: true,
        email: true,
        // Exclude password, add other fields you need
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error at get user profile", error);
    res.status(400).send("Unknown error");
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
     select:{
      id: true,
      name: true,
      email: true,
     }
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout Successfully");
  } catch (error) {
    console.error("Error at logout", error);
    res.status(400).send("Unknown error");
  }
};
export const getUserData = async (req, res) => {
  // Assuming the token is sent in the body under a property named "token"
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).send("Token not provided");
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_Secret);

    // Assuming the decoded token contains an email field
    const useremail = decoded.email;

    const userData = await prisma.user.findUnique({
      where: { email: useremail },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!userData) {
      return res.status(404).send("User not found");
    }

    return res.send({ status: "ok", data: userData });
  } catch (error) {
    console.error("Error getting user data", error);
    // It's a good practice to not send the error details directly to the client
    // as it can expose underlying implementation details or vulnerabilities.
    res.status(400).send("Failed to retrieve user data");
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .send({ status: false, message: "Email is required" });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!userExists) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = generateCode(); // Assuming this generates a 6-digit code as you wanted
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save reset token and its expiry to the user
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Send reset token to user's email
    sendCodeEmail(email, resetToken);

    res.status(200).send({ status: true, message: "Reset code sent to email" });
  } catch (error) {
    console.error("Error at forgot password", error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .send({
        status: false,
        message: "Reset token and new password are required",
      });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Ensure the token hasn't expired
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with new password and clear reset token fields
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).send({ status: true, message: "Password has been reset" });
  } catch (error) {
    console.error("Error at reset password", error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};
export const checkToken = async (req, res) => {
  const { email, token } = req.body;

  if (!token || !email) {
    return res
      .status(400)
      .send({
        status: false,
        message: "Reset token and email are required",
      });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Ensure the token hasn't expired
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid or expired reset token" });
    }
    res.status(200).send({ status: true, message: "token is correct" });
  } catch (error) {
    console.error("Error at reset password", error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};



export const deleteUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await prisma.user.delete({
          where: { id: userId },
      });

      if (!user) {
          return res.status(404).json({ status: false, message: "Unknown user" });
      }

      return res.status(200).json({ status: true, message: "Deleted Successfully" });
  } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ status: false, message: "Something went wrong" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;
    const lowercasedEmail = email.toLowerCase();

    // Check if another user with the same email exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: lowercasedEmail,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email already in use" });
    }

    const updates = {
      name: name.toLowerCase(),
      email: lowercasedEmail,
    };

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "Unknown user" });
    }

    return res.status(200).json({ status: true, message: "Updated successfully", user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ status: false, message: "Something went wrong" });
  }
};


export const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
              id: true,
              name: true,
              email: true,
          },
      });

      if (!user) {
          return res.status(404).json({ status: false, message: "Unknown user" });
      }

      return res.status(200).json({ user });
  } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ status: false, message: "Something went wrong" });
  }
};