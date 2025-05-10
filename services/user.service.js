const db = require("../config/db.config");
const bcrypt = require("bcrypt");

class UserService {
  static async checkIfUserExistsByEmail(user_email) {
    const user = await db.query("SELECT * FROM users WHERE user_email = ?", [
      user_email,
    ]);
    return user.length > 0;
  }

  static async getUser(userId) {
    try {
      const [user] = await db.query(
        `SELECT 
    u.user_id, u.user_email, r.user_role_id, c.company_role_name AS user_role, u.is_active, 
    ui.user_first_name, ui.user_last_name, ui.user_phone
  FROM users u
  JOIN users_info ui ON u.user_id = ui.user_id
  JOIN users_role r ON u.user_id = r.user_id
  JOIN company_roles c ON r.company_role_id = c.company_role_id
  WHERE u.user_id = ?`,
        [userId]
      );

      if (!user) {
        throw new Error("User not found.");
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getAllUsers() {
    try {
      const users = await db.query(
        `
  SELECT 
    users.*, 
    users_info.*, 
    users_role.*, 
    company_roles.company_role_name AS user_role, 
    CONCAT(users_info.user_first_name, ' ', users_info.user_last_name) AS full_name
  FROM users
  INNER JOIN users_info ON users.user_id = users_info.user_id 
  INNER JOIN users_role ON users.user_id = users_role.user_id
  INNER JOIN company_roles ON users_role.company_role_id = company_roles.company_role_id
  `
      );

      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createUser(userData) {
    try {
      const {
        user_email,
        user_first_name,
        user_last_name,
        user_pass,
        user_phone,
      } = userData;

      const hashedPassword = await bcrypt.hash(user_pass, 10);

      const userResult = await db.query(
        "INSERT INTO users (user_email, is_active) VALUES (?, ?)",
        [user_email, true]
      );
      if (!userResult.insertId) throw new Error("Failed to create user.");

      const userId = userResult.insertId;

      await db.query(
        "INSERT INTO users_info (user_id, user_first_name, user_last_name, user_phone) VALUES (?, ?, ?, ?)",
        [userId, user_first_name, user_last_name, user_phone || null]
      );

      await db.query(
        "INSERT INTO users_pass (user_id, user_password_hashed) VALUES (?, ?)",
        [userId, hashedPassword]
      );
      await db.query(
        "INSERT INTO users_role (user_id, company_role_id) VALUES (?, ?)",
        [userId, 1]
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createUserAdmin(userData) {
    try {
      const {
        user_email,
        user_first_name,
        user_last_name,
        user_pass,
        user_phone,
        company_role_id,
        is_active,
      } = userData;
      const hashedPassword = await bcrypt.hash(user_pass, 10);

      const userResult = await db.query(
        "INSERT INTO users (user_email, is_active) VALUES (?, ?)",
        [user_email, is_active]
      );

      if (!userResult.insertId) throw new Error("Failed to create user.");

      const userId = userResult.insertId;

      await db.query(
        "INSERT INTO users_info (user_id, user_first_name, user_last_name, user_phone) VALUES (?, ?, ?, ?)",
        [userId, user_first_name, user_last_name, user_phone]
      );

      await db.query(
        "INSERT INTO users_pass (user_id, user_password_hashed) VALUES (?, ?)",
        [userId, hashedPassword]
      );
      await db.query(
        "INSERT INTO users_role (user_id, company_role_id) VALUES (?, ?)",
        [userId, company_role_id]
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async updateUser(userId, userData) {
    try {
      const { user_first_name, user_last_name, user_phone, user_email } =
        userData;

      await db.query("UPDATE users SET user_email = ? WHERE user_id = ?", [
        user_email,
        userId,
      ]);
      await db.query(
        "UPDATE users_info SET user_first_name = ?, user_last_name = ?, user_phone = ? WHERE user_id = ?",
        [user_first_name, user_last_name, user_phone, userId]
      );

      return { user_id: userId, ...userData };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateUserAdmin(userId, userData) {
    try {
      const {
        user_email,
        company_role_id,
        is_active,
        user_first_name,
        user_last_name,
        user_phone,
      } = userData;
      await db.query(
        "UPDATE users SET user_email = ?, is_active = ? WHERE user_id = ?",
        [user_email, is_active, userId]
      );
      await db.query(
        "UPDATE users_info SET user_first_name = ?, user_last_name = ?, user_phone = ? WHERE user_id = ?",
        [user_first_name, user_last_name, user_phone, userId]
      );

      await db.query(
        "UPDATE users_role SET company_role_id =? WHERE user_id = ?",
        [company_role_id, userId]
      );
      return { user_id: userId, ...userData };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async deleteUser(userId) {
    try {
      const result = await db.query("DELETE FROM users WHERE user_id = ?", [
        userId,
      ]);

      if (result.affectedRows === 0) {
        return { status: false, message: "User not found." };
      }

      return { status: true, message: "User deleted successfully." };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getActiveUsersEmails() {
    try {
      const activeUsers = await db.query(
        `SELECT user_email FROM users WHERE is_active = true`
      );
      if (activeUsers.length === 0) {
        throw new Error("No active users found.");
      }
      return activeUsers.map((user) => user.user_email);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserService;
