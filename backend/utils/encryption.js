import crypto from "crypto";

const SECRET_KEY = Buffer.from(
    process.env.MESSAGE_ENCRYPTION_KEY,
    "utf8"
);

export const encryptMessage = (text) => {

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};

export const decryptMessage = (encryptedText) => {
  try {
    // If it isn't in iv:ciphertext format, it's an old plaintext message.
    if (!encryptedText || !encryptedText.includes(":")) {
      return encryptedText;
    }

    const [ivHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      SECRET_KEY,
      iv
    );

    let decrypted = decipher.update(
      encrypted,
      "hex",
      "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    // If decryption fails, return the original content instead of crashing.
    return encryptedText;
  }
};