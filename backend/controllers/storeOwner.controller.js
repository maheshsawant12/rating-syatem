import { getStoreAllRating, getUser } from "../models/queries.js";

const getRatings = async (req, res) => {
  const { id, role } = req.user;

  const ratings = await getStoreAllRating(id);

  if (ratings.length === 0) {
    return res.status(500).json({ message: "Rating Not Found" });
  }

  res.status(200).json(ratings);
};

export { getRatings };
