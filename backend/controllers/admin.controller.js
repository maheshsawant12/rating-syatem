import db from "../config/db.js";
import {
  addStores,
  addUser,
  adminDashboard,
  getAllUser,
  getuserDetail,
} from "../models/queries.js";

const validateEmail = (email) => {
  var emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const dashboard = async (req, res) => {
  const { role } = req.user;

  if (role !== "Admin") {
    res.status(401).json({ message: "Unauthorized Access" });
  }

  const result = await adminDashboard();

  res.status(200).json(result[0]);
};

const getUsers = async (req, res) => {
  const { role } = req.user;
  if (role !== "Admin") {
    return res.status(400).json({ message: "Unauthorized Access" });
  }

  const result = await getAllUser();

  res.status(200).json(result);
};

const addUserAndAdmin = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(402).json({ message: "Unauthorized Access" });
  }

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
    !validateEmail(email)
  ) {
    return res.status(400).json({ message: "Enter Valid Information" });
  }

  const result = await addUser(req.body);

  res.status(200).json(result[0]);
};

const addStore = async (req, res) => {
  const { role } = req.user;
  if (role !== "Admin") {
    return res.status(402).json({ message: "Unauthorized Access" });
  }

  const { name, email, address, owner_id } = req.body;

  if (
    [name, email, address].some(field => !field || field.trim() === "") ||
    !owner_id ||
    name.length < 20 ||
    name.length > 60 ||
    address.length > 400 ||
    !validateEmail(email)
  ) {
    return res.status(400).json({ message: "Enter Valid Information" });
  }

  const result = await addStores({ name, email, address, owner_id });

  if (!result) {
    return res.status(400).json({ message: "Owner must be a valid StoreOwner" });
  }

  return res.status(200).json(result);
};

export { dashboard, getUsers, addUserAndAdmin, addStore };
