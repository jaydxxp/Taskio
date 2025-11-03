const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());


const mainRouter = require("./routes");
const { connectDB } = require("./model"); 


app.use("/api/v1", mainRouter);


const PORT = 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB, server not started:", err.message || err);
    process.exit(1);
  });