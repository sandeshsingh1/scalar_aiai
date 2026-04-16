import nodemailer from "nodemailer";

const buildTransport = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const transport = buildTransport();

export const sendOrderConfirmation = async ({ user, order }) => {
  const info = await transport.sendMail({
    from: process.env.MAIL_FROM || "orders@flipkartclone.dev",
    to: user.email,
    subject: `Your order ${order.id} has been placed`,
    text: `Hi ${user.name}, your order ${order.id} worth INR ${order.summary.total} has been placed successfully.`
  });
  return info;
};
