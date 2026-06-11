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

type OrderEmailItem = { name: string; quantity: number; price: number };

export const sendOrderConfirmationEmail = async (
  to: string,
  order: {
    orderId: string;
    items: OrderEmailItem[];
    totalPrice: number;
    shippingAddress: { street: string; city: string; country: string; zip: string };
  }
) => {
  const rows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border:1px solid #e5e7eb">${i.name}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"ECommerce 2026" <${process.env.SMTP_USER}>`,
    to,
    subject: `Order Confirmed #${order.orderId.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#111">Your order is confirmed!</h2>
        <p style="color:#6b7280">Order <strong>#${order.orderId.slice(-6).toUpperCase()}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f9fafb">
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:left">Product</th>
              <th style="padding:8px;border:1px solid #e5e7eb">Qty</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="color:#6b7280">Ship to: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country} ${order.shippingAddress.zip}</p>
        <p style="font-size:18px;font-weight:bold">Total: $${order.totalPrice.toFixed(2)}</p>
        <p style="color:#9ca3af;font-size:12px">Thanks for shopping with us!</p>
      </div>
    `,
  });
};

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
