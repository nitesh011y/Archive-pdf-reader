import app from "./app.js";
import "dotenv/config";

app.listen(process.env.PORT || 3000, () =>
  console.log("server running on Port : ", process.env.PORT || 3000),
);
