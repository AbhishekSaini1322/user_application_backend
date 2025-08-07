const express = require('express');
const u_router = express.Router();
const { register, login, getProfile } = require("../controllers/profile");
const { addItem, updateItem, getItems, deleteItem } = require("../controllers/Items");
const { authenticator } = require("../utils/authuser");
const upload = require("../middleware/upload");


u_router.use((req, res, next) => authenticator.authenticateToken(req, res, next, "user"));

u_router.post("/register", register);
u_router.post("/login", login);
u_router.get("/get_profile", getProfile);
u_router.post("/add_item", upload.single("image"), addItem);
u_router.put("/update_item/:itemId", upload.single("image"), updateItem);
u_router.get("/get_items", getItems);
u_router.delete("/delete_item", deleteItem);


module.exports = u_router;
