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
    role == "StoreOwner" ||
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
    [name, email, address, owner_id].some((field) => {
      field?.trim() == "";
    }) ||
    name.length < 20 ||
    name.length > 60 ||
    address.length > 400 ||
    !validateEmail(email)
  ) {
    return res.status(400).json({ message: "Enter Valid Information" });
  }

  const result = await addStores(req.body);

  res.status(200).json({ message: "Store Created" });
};


const getAllUsers = async (req, res) => {
  const { name, email, address, role } = req.query;

  const conditions = [];
  const values = [];

  if (name) {
    values.push(`%${name.toLowerCase()}%`);
    conditions.push(`LOWER(name) LIKE $${values.length}`);
  }

  if (email) {
    values.push(`%${email.toLowerCase()}%`);
    conditions.push(`LOWER(email) LIKE $${values.length}`);
  }

  if (address) {
    values.push(`%${address.toLowerCase()}%`);
    conditions.push(`LOWER(address) LIKE $${values.length}`);
  }

  if (role) {
    values.push(role.toLowerCase());
    conditions.push(`LOWER(role) = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT id, name, email, address, role
    FROM users
    ${whereClause}
    ORDER BY name ASC;
  `;

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
};


const getStore = async (req, res) => {
  const { name, email, address } = req.query;

  console.log(`name: ${name} email: ${email} address: ${address}`);
  const filters = [];
  const values = [];

  if (name) {
    values.push(`%${name.toLowerCase()}%`);
    filters.push(`LOWER(s.name) LIKE $${values.length}`);
  }

  if (email) {
    values.push(`%${email.toLowerCase()}%`);
    filters.push(`LOWER(s.email) LIKE $${values.length}`);
  }

  if (address) {
    values.push(`%${address.toLowerCase()}%`);
    filters.push(`LOWER(s.address) LIKE $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const query = `
    SELECT s.id, s.name, s.email, s.address,
           ROUND(AVG(r.rating), 1) AS average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    ${whereClause}
    GROUP BY s.id, s.name, s.email, s.address
    ORDER BY s.name ASC;
  `;

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).send("No stores found.");
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).send("Internal Server Error");
  }
};


const getUsersDetail = async(req, res)=>{
    const {role} = req.user;
    if(role !== "Admin"){
        return res.status(401).json({message: "Unauthorized Access"})
    }
    
    const result = await getuserDetail();

    res.status(200).json(result);
}

export { dashboard, getUsers, getStore, getAllUsers, addUserAndAdmin, addStore, getUsersDetail };
