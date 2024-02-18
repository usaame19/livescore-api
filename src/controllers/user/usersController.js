import prisma from "../../../prisma/client.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { JWT_Secret } from "../../config/config.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const userExists = await prisma.user.findFirst({
            where: {

                    email: email.toLowerCase() ,
            },
        });

        if (userExists) {
            return res.status(400).send({ status: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.user.create({
            data: {
                name: name.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
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
            return res.status(400).send({ status: false, message: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send({ status: false, message: "Invalid username or password" });
        }

        const token = jwt.sign({ email: user.email }, JWT_Secret);

       
        delete user.password;

        res.status(200).send({status: 'success',  data: token });

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

export const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
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

        return res.send({ status: 'ok', data: userData });
    } catch (error) {
        console.error("Error getting user data", error);
        // It's a good practice to not send the error details directly to the client
        // as it can expose underlying implementation details or vulnerabilities.
        res.status(400).send("Failed to retrieve user data");
    }
};

