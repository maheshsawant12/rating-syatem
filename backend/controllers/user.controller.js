import db from "../config/db.js";
import { addRating, editRating } from "../models/queries.js";

const searchStore = async (req, res) => {
  const { role } = req.user;

  if (role !== "Normal") {
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

const rateStore = async (req, res) => {
  const { role, id } = req.user;

  if (role !== "Normal") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const { rating } = req.body;
  const storeId = req.params.id;

  await addRating(id, storeId, rating);

  res.status(200).json("Rating Added");
};

const alterRating = async (req, res) => {
  const { role, id } = req.user;
  const { rating } = req.body;
  const storeId = req.params.id;

  if (role !== "Normal") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  await editRating(rating, id, storeId);
  res.status(200).json({ message: "Rating Updated" });
};

export { searchStore, rateStore, alterRating };
