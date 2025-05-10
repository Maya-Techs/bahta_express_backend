const conn = require("../../config/db.config");
const jwt = require("jsonwebtoken");

async function getUserByEmail(user_email) {
  if (!user_email) throw new Error("Email parameter is missing.");

  try {
    let query = `
      SELECT * FROM users
      INNER JOIN users_info ON users.user_id = users_info.user_id 
      INNER JOIN users_pass ON users.user_id = users_pass.user_id 
      INNER JOIN users_role ON users.user_id = users_role.user_id 
      WHERE users.user_email = ?
    `;
    const rows = await conn.query(query, [user_email]);
    if (rows.length !== 0) {
      return { data: rows };
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  }
}

// getUserByEmail("natnaelhailu245@gmail.com")

async function checkActiveStatus(userEmail) {
  let query = "SELECT * FROM users WHERE users.user_email = ?";
  let rows = await conn.query(query, [userEmail]);
  if (rows.length > 0) {
    const is_active = rows[0].is_active === 1;
    return is_active;
  }
}

async function getOTPByEmail(email) {
  try {
    if (!email) throw new Error("Email parameter is missing.");
    const result = await conn.query(
      "SELECT token FROM otp_requests WHERE email = ?",
      [email]
    );

    return result.length > 0 ? result[0].token : null;
  } catch (error) {
    return null;
  }
}
const generateResetToken = (email) => {
  const payload = { email };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "10m" }; // Token will exp in 10 minutes
  //   sign the payload with secret key and exp..ion time ;)
  return jwt.sign(payload, secret, options);
};

module.exports = {
  getUserByEmail,
  getOTPByEmail,
  generateResetToken,
  checkActiveStatus,
};
