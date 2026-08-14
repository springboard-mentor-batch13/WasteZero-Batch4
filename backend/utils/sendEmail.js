import nodemailer from 'nodemailer';
import dns from 'dns';

const SMTP_HOST = 'smtp.gmail.com';
const resolve4 = dns.promises.resolve4;

let cachedIp = null;

const getSmtpIPv4 = async () => {
  if (cachedIp) return cachedIp;
  const addresses = await resolve4(SMTP_HOST);
  if (!addresses.length) throw new Error(`No IPv4 address found for ${SMTP_HOST}`);
  cachedIp = addresses[0];
  return cachedIp;
};

const sendEmail = async ({ to, subject, text }) => {
  const ip = await getSmtpIPv4();

  const transporter = nodemailer.createTransport({
    host: ip,
    port: 587,
    secure: false, // STARTTLS on 587
    tls: {
      servername: SMTP_HOST,
    },
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