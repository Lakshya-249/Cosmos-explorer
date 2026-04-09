import express from "express";
import userRoutes from "./routes/user.route.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.use("/api", userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
