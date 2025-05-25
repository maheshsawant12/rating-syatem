import db from "../config/db.js";
import bcrypt from "bcrypt";

const getAllStores = async () => {
  const { rows } = await db.query(
    "SELECT s.*, ROUND(AVG(r.rating), 1) AS average_rating FROM stores s LEFT JOIN ratings r ON s.id = r.store_id GROUP BY s.id;"
  );
  return rows;
};

const getUser = async (email) => {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1;",
    [email]
  );
  return rows;
};

const addUser = async ({ name, email, address, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    "INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, address, hashedPassword, role]
  );

  return rows;
};

const updatePassword = async ({ id, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await db.query(
    "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
    [hashedPassword, id]
  );

  return rows;
};

const getStoreRating = async (storeId) => {
  const { rows } = await db.query(
    "SELECT s.name, s.address, ROUND(AVG(r.rating), 1) AS average_rating FROM stores s LEFT JOIN ratings r ON s.id = r.store_id WHERE s.id = $1 GROUP BY s.id;",
    [storeId]
  );

  return rows;
};

const getStoresAllRatings = async (storeId) => {
  const { rows } = await db.query(
    `
    SELECT 
      r.id,
      r.user_id,
      u.name AS user_name,
      r.store_id,
      r.rating,
      r.created_at
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.store_id = $1
    ORDER BY r.created_at DESC;
    `,
    [storeId]
  );

  return rows;
};


const insertRefreshToken = async (id, token) => {
  const { rows } = await db.query("select * from users where id = $1 limit 1", [
    id,
  ]);

  if (rows.length === 0) {
    return "User Not Found";
  }

  const result = await db.query(
    "update users set refreshtoken = $1 where id = $2 RETURNING *",
    [token, id]
  );

  return result.rows;
};

const removeRefreshToken = async (userId) => {
  await db.query("update users set refreshtoken = '' where id = $1", [userId]);
};

const addRating = async (id, storeId, rating) => {
  const { rows } = await db.query(
    "insert into ratings (user_id, store_id, rating) values ($1, $2, $3)",
    [id, storeId, rating]
  );

  return rows;
};

const editRating = async (rating, id, storeId) => {
  await db.query(
    "update ratings set rating = $1 where user_id = $2 and store_id = $3",
    [rating, id, storeId]
  );
};

const getStoreAllRating = async (id) => {
  const { rows } = await db.query(
    "SELECT r.*, u.id AS user_id, u.name AS user_name, u.email AS user_email FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id IN (SELECT id FROM stores WHERE owner_id = $1);",
    [id]
  );

  const avg_rating = await db.query(
    "SELECT ROUND(AVG(r.rating), 1) AS average_rating FROM ratings r WHERE r.store_id IN (SELECT s.id FROM stores s WHERE s.owner_id = $1);",
    [id]
  );

  const result = {
    average_rating: avg_rating.rows[0].average_rating,
    all_rating: rows,
  };
  return result;
};

const adminDashboard = async () => {
  const { rows } = await db.query(
    "SELECT (SELECT COUNT(*) FROM users) AS total_users, (SELECT COUNT(*) FROM stores) AS total_stores, (SELECT COUNT(*) FROM ratings) AS total_ratings;"
  );

  return rows;
};

const addStores = async ({ name, email, address, owner_id }) => {
  const userResult = await db.query(
    "SELECT role FROM users WHERE id = $1;",
    [owner_id]
  );

  if (userResult.rows.length === 0 || userResult.rows[0].role !== 'StoreOwner') {
    return null;
  }

  const insertResult = await db.query(
    "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *;",
    [name, email, address, owner_id]
  );

  return insertResult.rows;
};


const getAllUser = async () => {
  const { rows } = await db.query(`
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.address, 
      u.role,
      CASE 
        WHEN u.role = 'StoreOwner' THEN COALESCE(sr.avg_rating, 0)
        ELSE NULL
      END AS rating
    FROM users u
    LEFT JOIN (
      SELECT 
        s.owner_id, 
        ROUND(AVG(r.rating), 2) AS avg_rating
      FROM stores s
      JOIN ratings r ON r.store_id = s.id
      GROUP BY s.owner_id
    ) sr ON u.id = sr.owner_id;
  `);

  return rows;
};


const getuserDetail = async () => {
  const { rows } = await db.query(
    "SELECT u.name, u.email, u.address, u.role, ROUND(AVG(r.rating), 1) AS average_rating FROM users u LEFT JOIN stores s ON u.id = s.owner_id LEFT JOIN ratings r ON s.id = r.store_id GROUP BY u.id, u.name, u.email, u.address, u.role;"
  );

  return rows;
};

export {
  getAllStores,
  getUser,
  addUser,
  updatePassword,
  getStoreRating,
  getStoresAllRatings,
  insertRefreshToken,
  removeRefreshToken,
  addRating,
  editRating,
  getStoreAllRating,
  adminDashboard,
  addStores,
  getAllUser,
  getuserDetail
};
