import { app } from "./app.js";
import { config } from "dotenv";
import db from "./config/db.js";

config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Is Listening on ${port}`);
});
