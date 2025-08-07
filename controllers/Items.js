const Item = require("../models/items");

// const addItem = async (req, res) => {
//   try {
//     const { uid } = req.user
//     console.log("uid...........", uid)
//     console.log("req.user.................", req.user)
//     console.log("body...........", req.body)
//     console.log("req.file...........", req.file)
//     console.log("req.files...........", req.files)
//     console.log("Headers...........", req.headers['content-type'])
    
//     if(!uid){
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const { title, description, price } = req.body;

//     if (!title || !description || !price || !req.file) {
//       console.log("Missing fields:", { title: !!title, description: !!description, price: !!price, file: !!req.file });
//       return res.status(400).json({ message: "All fields including image are required" });
//     }

//     if (typeof title !== "string" || typeof description !== "string") {
//       return res.status(400).json({ message: "Title and description must be strings" });
//     }

//     if (isNaN(price)) {
//       return res.status(400).json({ message: "Price must be a number" });
//     }

//     const image = req.file.path;

//     const newItem = await Item.create({
//       title,
//       description,
//       price,
//       image,
//       uid,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Item created successfully",
//     });
//   } catch (error) {
//     console.error("Add Item Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


const addItem = async (req, res) => {
  try {
    const { uid } = req.user; // assuming verifyToken sets req.user
console.log("req.file...........", req.file);

    const { title, description, price } = req.body;
    const image = req.file?.path;

    if (!title || !description || !price) {
      return res.status(400).json({
        message: "All fields including image are required",
      });
    }

    if (typeof title !== "string" || typeof description !== "string") {
      return res.status(400).json({ message: "Title and description must be strings" });
    }

    if (isNaN(price)) {
      return res.status(400).json({ message: "Price must be a number" });
    }

    const newItem = await Item.create({
      title,
      description,
      price,
      image,
      uid,
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Add Item Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description, price } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    if (title && typeof title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }
    if (description && typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (price && isNaN(price)) {
      return res.status(400).json({ message: "Price must be a number" });
    }

    const updatedData = { title, description, price };
console.log("req.file", req.file)
    // If image is uploaded
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedItem = await Item.findOneAndUpdate(
      { itemId: Number(itemId) },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update Item Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getItems = async (req, res) => {
  try {
    const {
      itemId, 
      uid,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 9,
    } = req.query;

    const filter = {};

    if (itemId) filter.itemId = Number(itemId);
    // if (uid) filter.uid = Number(uid);            // for admin

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🔢 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 📦 Fetch data
    const [items, totalItems] = await Promise.all([
      Item.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Item.countDocuments(filter),
    ]);

    // 📤 Response
    res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    });

  } catch (error) {
    console.error("Get Items Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.query;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "itemId is required in query" });
    }

    const uid = req.user?.uid;
    const role = req.user?.role;

    if (!uid || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Missing user info",
      });
    }

    // If role is admin, allow deleting any item; otherwise, match uid
    const filter = { itemId: Number(itemId) };
    if (role !== "admin") {
      filter.uid = uid;
    }

    const deletedItem = await Item.findOneAndDelete(filter);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found or you're not authorized to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      deletedItem,
    });
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = { addItem, updateItem, getItems, deleteItem };
