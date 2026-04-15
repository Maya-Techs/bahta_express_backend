require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  getUserByEmail,
  checkActiveStatus,
} = require("../utils/Auth/auth.helper");

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized Access",
      });
    }

    try {
      const isActive = await checkActiveStatus(decoded.user_email);
      if (!isActive) {
        return res.status(403).send({
          status: "fail",
          message: `Hello ${decoded.user_first_name}, your account is not active. Please contact the administrator.`,
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error while checking account status.",
      });
    }

    req.user_email = decoded.user_email;
    req.user_id = decoded.user_id;

    next();
  });
};
const isAdmin = async (req, res, next) => {
  const email = req.user_email;
  const user = await getUserByEmail(email);
  if (user.data[0].company_role_id === 2) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Permission Denied. Admin Access Only!",
    });
  }
};

const IsAuthorized = async (req, res, next) => {
  const email = req.user_email;

  const user = await getUserByEmail(email);
  if (
    user.data[0]?.company_role_id === 2 ||
    user.data[0]?.company_role_id === 1
  ) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Restricted Access",
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  IsAuthorized,
};

module.exports = authMiddleware;
