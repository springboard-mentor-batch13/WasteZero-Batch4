import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: `"WasteZero" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;