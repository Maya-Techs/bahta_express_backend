const UserService = require("../services/user.service");

async function createUserAdmin(req, res) {
  try {
    const userData = req.body;

    const exist = await UserService.checkIfUserExistsByEmail(
      userData.user_email
    );

    if (exist) {
      return res.status(400).json({
        status: false,
        message: "User with this email already exists. Check and try again.",
      });
    }
    if (
      !userData.user_pass ||
      !userData.user_email ||
      !userData.user_first_name ||
      !userData.user_last_name ||
      !userData.company_role_id ||
      !userData.is_active
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const newUser = await UserService.createUserAdmin(userData);
    return res.status(201).json({
      status: true,
      message: "User created successfully.",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const user = await UserService.getAllUsers();

    return res.status(200).json({
      status: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { user_id } = req;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const user = await UserService.getUser(user_id);
    return res.status(200).json({
      status: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const userData = req.body;

    if (
      userData.user_first_name === "" ||
      userData.user_last_name === "" ||
      userData.user_email === "" ||
      userData.user_phone === ""
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const updatedUser = await UserService.updateUser(userId, userData);

    return res.status(200).json({
      status: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function updateUserAdmin(req, res) {
  try {
    const userId = req.params.user_id;
    const userData = req.body;

    if (
      userData.is_active === "" ||
      userData.user_role === "" ||
      userData.user_email === "" ||
      userData.user_first_name === "" ||
      userData.user_last_name === "" ||
      userData.user_phone === ""
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const updatedUser = await UserService.updateUserAdmin(userId, userData);
    return res.status(200).json({
      status: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.user_id;

  try {
    const result = await UserService.deleteUser(userId);

    return res.status(200).json({
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  createUserAdmin,
  updateUserAdmin,
};
