import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  await transporter.sendMail({
    from: `"ECommerce 2026" <${process.env.SMTP_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      ">Reset Password</a>
      <p>This link expires in <strong>1 hour</strong>.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};
