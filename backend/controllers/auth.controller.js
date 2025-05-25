import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getUser,
  addUser,
  updatePassword,
  insertRefreshToken,
  removeRefreshToken,
} from "../models/queries.js";

const validateEmail = (email) => {
  var emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const generateAccessToken = ({ id, email, address, role }) => {
  return jwt.sign(
    {
      id,
      email,
      address,
      role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const registerUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (
    [name, email, password, address, role].some(
      (field) => field?.trim() == ""
    ) ||
    name.length < 20 ||
    name.length > 60 ||
    address.length > 400 ||
    password.length < 8 ||
    password.length > 16 ||
    role !== "Normal" ||
    !validateEmail(email)
  ) {
    return res.status(403).send("Enter Valid Information!");
  }

  try {
    const user = await getUser(email);

    if (user.length > 0) {
      return res.status(403).send("User Already Exists!");
    }

    const result = await addUser(req.body);

    if (!result) {
      return res.status(503).send("User Not Created.");
    }

    res.status(200).send("User Created");
  } catch (err) {
    console.log(err);
    res.status(500).send("⚠️ Server Error!");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validateEmail(email)) {
      return res.status(401).send("Invalide Email!");
    }

    const result = await getUser(email);

    if (result.length === 0) {
      return res.status(401).send("User Not Found!");
    }

    const user = result[0];

    const validatePassword = await bcrypt.compare(password, result[0].password);

    if (!validatePassword) {
      return res.status(401).send("Wrong Password");
    }

    const accessToken = await generateAccessToken({
      id: user.id,
      email: user.email,
      address: user.address,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken(result[0].id);
    const tokenInserted = await insertRefreshToken(result[0].id, refreshToken);

    if (tokenInserted.length === 0) {
      return res.send("Error Generating Refresh Token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ id: user.id, role: user.role});
  } catch (err) {
    console.log(err);
  }
};

const changePassword = async (req, res) => {
  const { password } = req.body;

  try {
    const id = req.user.id;

    if (!password) {
      return res.status(400).send("Password is required.");
    }

    const updatedUser = await updatePassword({ id, password });

    if (updatedUser.length === 0) {
      return res.status(500).send("Password not changed!");
    }

    res.status(202).send("Password Changed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


const refreshAccessToken = async () => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) return res.status(401).send("Refresh token missing");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    const result = await db.query(
      "SELECT * FROM users where id = $1 refreshtoken = $2",
      [userId, refreshToken]
    );

    if (result.rows === 0) {
      return res.status(403).send("Refresh token not found");
    }

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        address: decoded.address,
        role: decoded.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).send("Access token refreshed");
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  const id = req.user.id;
  await removeRefreshToken(id);

  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    .status(200)
    .json({ message: "User Logged Out." });
};

export { registerUser, loginUser, changePassword, refreshAccessToken, logout };
