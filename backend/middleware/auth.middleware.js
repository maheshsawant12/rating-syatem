import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  console.log("Access Token: ", token);

  const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  req.user = user;
  next();
};

export { verifyJWT };
