const express = require("express");
const app = express();
require("dotenv").config();
const u_router = require("./routes/userRoute");
const PORT = process.env.PORT || 3000;
const connectWithDB = require("./config/database");
connectWithDB();

// middleware
app.use(express.json());
const cors = require('cors');
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));

app.use('/user', u_router)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`<h1>Hello</h1>`);
});
