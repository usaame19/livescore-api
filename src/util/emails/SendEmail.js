import nodemailer from 'nodemailer';
import { APP_PASSWORD } from '../../config/config.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "usaameshsaid19@gmail.com",
        pass: APP_PASSWORD
    }
});

const sendCodeEmail = async (to, code) => {
    const mailOptions = {
        from: "umma@gmail.com",
        to,
        subject: "Password Reset Code",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #007bff;
            font-size: 24px;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .code {
            letter-spacing: 3px;
            font-weight: bold;
            font-size: 24px;
            color: #007bff;
            text-align: center;
            padding: 20px 0;
            border: 1px dashed #007bff;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #aaa;
          }
        </style>
        </head>
        <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>Hello,</p>
          <p>You recently requested to reset your password for your account. Use the code below to reset it. This password reset code is only valid for the next 30 minutes.</p>
          <div class="code">${code}</div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p>Thanks,<br>The Team</p>
          <div class="footer">
            <p>&copy; 2024 Umma University. All rights reserved.</p>
          </div>
        </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }

};

export default sendCodeEmail;