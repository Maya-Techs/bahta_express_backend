const conn = require("../config/db.config");
const bcrypt = require("bcrypt");
const { getUserByEmail } = require("../utils/Auth/auth.helper");

const storeResetToken = async (email, token) => {
  await conn.query(
    "INSERT INTO password_reset_requests (email, token) VALUES (?, ?)",
    [email, token]
  );
};

const checkResetToken = async (email) => {
  const rows = await conn.query(
    "SELECT * FROM password_reset_requests WHERE email = ?",
    [email]
  );
  return rows.length > 0;
};

const updatePassword = async (email, hashedPassword) => {
  await conn.query(
    "UPDATE users_pass SET user_password_hashed = ? WHERE user_id = (SELECT user_id FROM users WHERE user_email = ?)",
    [hashedPassword, email]
  );
  await conn.query("DELETE FROM password_reset_requests WHERE email = ?", [
    email,
  ]);
};

async function changePWD(newPassword, oldPassword, userEmail) {
  try {
    let returnData = {};
    const user = await getUserByEmail(userEmail);

    if (!user || !user.data || user.data.length === 0) {
      return {
        status: "fail",
        message: "User not found.",
      };
    }

    const password = user.data[0].user_password_hashed;

    const email = user.data[0].user_email;

    const passwordMatch = await bcrypt.compare(oldPassword, password);

    if (!passwordMatch) {
      return {
        status: "fail",
        message: "Old password is incorrect. Please check and try again.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query =
      "UPDATE user_pass SET user_password_hashed = ? WHERE user_id = (SELECT user_id FROM user WHERE user_email = ?)";

    await conn.query(query, [hashedPassword, email]);

    return {
      status: "success",
      message: "Password has been successfully updated.",
    };
  } catch (error) {
    console.error("Error in changePWD:", error);
    return {
      status: "error",
      message: "An error occurred while updating the password.",
    };
  }
}
module.exports = {
  storeResetToken,
  updatePassword,
  changePWD,
  checkResetToken,
};
