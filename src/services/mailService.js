const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Voltra <noreply@voltra.com>',
    to: email,
    subject: 'Email Verification - Voltra',
    html: `
      <h1>Verify Your Email</h1>
      <p>Thank you for registering with Voltra. Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendOtpEmail = async (email, otp, type = 'Verification') => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Voltra <noreply@voltra.com>',
    to: email,
    subject: `${type} OTP - Voltra`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">${type} OTP</h2>
        <p>Hello,</p>
        <p>Your OTP for ${type.toLowerCase()} is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background: #f0f7ff; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2024 Voltra. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
