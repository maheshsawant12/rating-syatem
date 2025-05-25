import db from "../config/db.js";
import { getAllStores, getStoreRating, getStoresAllRatings } from "../models/queries.js";

const getStores = async (req, res) => {
  const stores = await getAllStores();
  const { role } = req.user;

  if (role !== "Normal" && role !== "Admin") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  if (stores.length === 0) {
    return res.status(404).send("No Stores Available.");
  }

  res.status(200).json(stores);
};


const StoreRating = async (req, res) => {
  const storeId = req.params.id;

  console.log(storeId);

  try {
    const store = await getStoreRating(storeId);

    if (store.length === 0) {
      return res.send("Store Does Not Exist!");
    }

    const ratings = await getStoresAllRatings(storeId);

    if (ratings.length === 0) {
      return res.send("Something Went Wrong");
    }

    const response = { store: store[0], rating: ratings };

    res.json(response);
  } catch (err) {
    console.log(err);
  }
};


const searchStore = async (req, res) => {
  const { role } = req.user;

  if (role !== "Normal" && role !== "Admin") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const q = req.query.q?.trim().toLowerCase();
  if (!q) return res.status(400).send("Search something");

  const tokens = q.split(/\s+/);
  const values = [];
  const conditions = tokens.map((token, i) => {
    const param = `%${token}%`;
    values.push(param, param);
    const nameParam = `$${values.length - 1}`;
    const addressParam = `$${values.length}`;
    return `(LOWER(s.name) LIKE ${nameParam} OR LOWER(s.address) LIKE ${addressParam})`;
  });

  const whereClause = conditions.join(" AND ");

  const query = `
    SELECT s.id, s.name, s.address,
           ROUND(AVG(r.rating), 1) AS average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE ${whereClause}
    GROUP BY s.id;
  `;

  try {
    const { rows } = await db.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getStore = async (req, res) => {
  const { name, email, address } = req.query;

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
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).send("No stores found.");
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).send("Internal Server Error");
  }
};




export {getStores, getStore, searchStore, StoreRating}