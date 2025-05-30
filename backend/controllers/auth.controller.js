const User = require('../models/user.models');
const Otp = require('../models/otp.models.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService.js');
const { otpEmailTemplate, welcomeEmailTemplate } = require('../utils/emailTemplates.js');
const salt = parseInt(process.env.SALT);

const generateOTP = () => Math.floor(10000 + Math.random() * 90000).toString();

// create new employee controller
const createUserController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalisedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email Already Exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);
        const newUser = new User({
            name,
            email: normalisedEmail,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        await sendEmail(normalisedEmail, 'Welcome to MelodyHub', welcomeEmailTemplate(name));

        // Just return success message
        res.status(200).json({ message: 'User Created Successfully!' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

// login controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email enetered is invalid!' });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Wrong Password!' });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Delete previous OTPs (optional but recommended)
        await Otp.deleteMany({ email });

        await sendEmail(email, "Your Login OTP", otpEmailTemplate(otp));
        // Store OTP in DB
        await Otp.create({ email, code: otp, expiresAt, task: "login" });

        res.cookie("pendingUser", { email, task:"login" }, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 10 * 60 * 1000 // 5 minutes
        });

        return res.status(200).json({ message: "OTP Sent Successfully!" });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

// verify otp controller
const verifyOtpController = async (req, res) => {
    try {
        const { otp } = req.body;
        const pendingUser = req.cookies.pendingUser;

        if (!pendingUser || !pendingUser.email || !pendingUser.task) {
            return res.status(400).json({ message: "Session expired or invalid. Please try again." });
        }

        const { email, task } = pendingUser;

        // Find OTP with both email and task
        const record = await Otp.findOne({ email, task });

        if (!record) {
            return res.status(400).json({ message: "No OTP found for this task. Please try again." });
        }

        if (record.code !== otp) {
            return res.status(401).json({ message: "Invalid OTP." });
        }

        if (new Date() > record.expiresAt) {
            await Otp.deleteOne({ _id: record._id }); // clean expired OTP
            return res.status(400).json({ message: "OTP expired. Please try again." });
        }

        // OTP valid — delete it
        await Otp.deleteOne({ _id: record._id });
        res.clearCookie("pendingUser");

        if (task === 'login') {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            const payload = {
                id: user._id,
                email: user.email,
                role: user.role
            };
            const secret = process.env.JWT_SECRET;

            const token = jwt.sign(payload, secret, { expiresIn: '1h' });

            res.cookie("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000
            });

            res.status(200).json({
                message: "Login Successful",
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                task
            });

        } else if (task === 'resetPassword') {
            res.cookie("pendingPasswordReset", email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 5 * 60 * 1000
            });

            res.status(200).json({
                message: "OTP Verified Successfully! Proceed to reset your password.",
                task
            });
        } else {
            return res.status(400).json({ message: "Invalid task specified in session." });
        }

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// forgot password controller
const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email' });
        };

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Delete previous OTPs (optional but recommended)
        await Otp.deleteMany({ email });

        await sendEmail(email, "Your OTP for Forget Password Request", otpEmailTemplate(otp));
        // Store OTP in DB
        await Otp.create({ email, code: otp, expiresAt, task: "resetPassword" });

        res.cookie("pendingUser", { email, task:"resetPassword" }, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 10 * 60 * 1000 // 5 minutes
        });

        return res.status(200).json({ message: "OTP Sent Successfully!" });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// reset password controller
const resetPasswordController = async (req, res) => {
    try {
        const email = req.cookies.pendingPasswordReset;
        const password = req.body.password;

        if (!email) {
            return res.status(400).json({ message: "No reset request found." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        // Clear the cookie after reset
        res.clearCookie("pendingPasswordReset");

        res.status(200).json({ message: "Password Reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// changePassword controller
const changePassword = async (req, res) => {
    console.log('inside changePassword controller');
    try {
        const { newPassword } = req.body;
        console.log('New password: ', newPassword);
        const decoded = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
        const email = decoded.email;
        console.log(`${email} decoded`);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User Not Found!' });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(409).json({ message: 'Password must be different!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
        user.password = hashedPassword;
        user.updated_at = new Date();

        await user.save();

        res.status(200).json({ message: "Password Updated Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in Updating Password" });
    }
};

// logout controller
const logoutController = (req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
        });

        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!", error });
    }
}

module.exports = {
    loginController,
    logoutController,
    verifyOtpController,
    createUserController,
    changePassword,
    forgotPasswordController,
    resetPasswordController
};