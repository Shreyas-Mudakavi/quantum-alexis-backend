const express = require("express");
const isAdmin = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Business = require("../models/businessModel");
const Package = require("../models/packageModel");

// Admin dashboard route protected with isAdmin middleware
router.get("/dashboard", async (req, res) => {
  // This route can be accessed only by admins
  // Your admin dashboard logic goes here...
  res.json({ message: "Admin Dashboard", success: true });
});

//---------- /dashboard/users -----------------------//

router.get("/dashboard/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({ message: "No users available!" });
    }

    res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

//---------- /dashboard/users/new-user -----------------------//

router.post("/dashboard/users/new-user", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(409)
        .send({ message: "User already exists", success: false });
    }

    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);

    const businessFields = Object.keys(Business.schema.paths);

    if (businessFields.some((field) => req.body[field])) {
      // Only create the Business and associate it with the User if any business-related data is provided
      const newBusiness = new Business(req.body);

      newBusiness.user = newUser._id;

      newUser.businesses.push(newBusiness._id);

      await newBusiness.save();
    }

    await newUser.save();

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error creating user", success: false });
  }
});

//---------- /dashboard/users/:id -----------------------//

router.get("/dashboard/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

router.patch("/dashboard/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const newData = req.body;
    const user = await User.findByIdAndUpdate(userId, newData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "Account settings updated successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating user data" });
  }
});

router.delete("/dashboard/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const business = await Business.deleteMany({ user: userId });

    if (!business) {
      res.json({
        message: "Business associated with user not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User Account deleted successfully",
      success: true,
      //   data: [user, business],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting user data" });
  }
});

//---------- /dashboard/users/:id/businesses -----------------------//

router.post(
  "/dashboard/users/:id/businesses/new-business",
  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!userId) {
        return res
          .status(404)
          .json({ message: "User id error", success: false });
      }

      const newBusiness = new Business(req.body);

      newBusiness.user = userId;
      newBusiness.userName = user.firstName + " " + user.lastName;

      user.businesses.push(newBusiness._id);
      user.businessesName.push(newBusiness.businessName);

      await user.save();
      await newBusiness.save();

      res.status(200).json({
        message: "Business created successfully",
        success: true,
        data: newBusiness,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error creating business" });
    }
  }
);

router.get("/dashboard/users/:id/businesses", async (req, res) => {
  try {
    const userId = req.params.id;
    const business = await Business.find({ user: userId });

    if (business.length == 0) {
      return res
        .status(404)
        .json({ message: "No Business found", success: false });
    }

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching business" });
  }
});

router.delete("/dashboard/users/:id/businesses", async (req, res) => {
  try {
    const userId = req.params.id;

    const business = await Business.deleteMany({ user: userId });

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found", success: false });
    }

    res.status(204).json({
      message: "Business Account deleted successfully",
      success: true,
      data: business,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting user data" });
  }
});

router.get("/dashboard/users/:id/businesses/:bid", async (req, res) => {
  try {
    const businessId = req.params.bid;
    const business = await Business.findById(businessId);

    if (!business) {
      return res
        .status(404)
        .json({ message: "No Business found", success: false });
    }

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching business" });
  }
});

router.patch("/dashboard/users/:id/businesses/:bid", async (req, res) => {
  try {
    const businessId = req.params.bid;
    const newData = req.body;
    const business = await Business.findByIdAndUpdate(businessId, newData, {
      new: true,
      runValidators: true,
    });

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found", success: false });
    }

    res.status(200).json({
      message: "Business settings updated successfully",
      success: true,
      data: business,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating business data" });
  }
});

router.delete("/dashboard/users/:id/businesses/:bid", async (req, res) => {
  try {
    const businessId = req.params.bid;

    const business = await Business.findByIdAndDelete(businessId);

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found", success: false });
    }

    res.status(204).json({
      message: "Business Account deleted successfully",
      success: true,
      data: business,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting business data" });
  }
});

//--------------------------------------------------------- Packages ----------------------------------

//------------------- /dashboard/packages ------------------------------

router.post("/dashboard/packages/new-package", async (req, res) => {
  try {
    const packageExists = await Package.findOne({
      packageName: req.body.packageName,
    });
    const data = req.body;

    if (packageExists) {
      return res.status(409).send({
        message: "Package with same name already exists",
        success: false,
      });
    }

    const package = new Package(data);
    await package.save();
    res.status(201).json({
      message: "package created successfully",
      success: true,
      package: package,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating package" });
  }
});

router.get("/dashboard/packages", async (req, res) => {
  try {
    const packages = await Package.find({});

    if (packages.length == 0) {
      return res
        .status(404)
        .json({ message: "No packages found", success: false });
    }

    res.status(200).json({ success: true, packages: packages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching packages" });
  }
});

router.get("/dashboard/packages/:id", async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await Package.findById(packageId);

    if (!package) {
      return res
        .status(404)
        .json({ message: "No package found", success: false });
    }

    res.status(200).json({ success: true, package: package });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching package" });
  }
});

router.patch("/dashboard/packages/:id", async (req, res) => {
  try {
    const packageId = req.params.id;
    const updates = req.body;
    const package = await Package.findByIdAndUpdate(packageId, updates, {
      new: true,
      runValidators: true,
    });

    if (!package) {
      return res
        .status(404)
        .json({ message: "No Package found", success: false });
    }

    res.status(200).json({
      message: "Package updated successfully",
      success: true,
      package: package,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating package" });
  }
});

router.delete("/dashboard/packages/:id", async (req, res) => {
  try {
    const packageId = req.params.id;

    const package = await Package.findByIdAndDelete(packageId);
    if (!package) {
      return res
        .status(404)
        .json({ message: "No Package found", success: false });
    }

    res.status(200).json({
      message: "Package deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting package" });
  }
});

//--------------------------------------------------------- Orders ----------------------------------

router.get("/dashboard/orders", async (req, res) => {
  try {
    const orders = await Order.find({});

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No Orders found!", success: false });
    }

    res.status(200).json({ success: true, orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

// router.get("/dashboard/users/:id/businesses/:bid/orders", async (req, res) => {
//   try {
//     const businessId = req.params.bid;
//     const orders = await Order.find({ business: businessId });

//     if (orders.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No Orders found!", success: false });
//     }

//     res.status(200).json({ success: true, orders: orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error fetching orders" });
//   }
// });

// router.get("/dashboard/users/:id/orders", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const orders = await Order.find({ user: userId });

//     if (orders.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No Orders found!", success: false });
//     }

//     res.status(200).json({ success: true, orders: orders });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error fetching orders" });
//   }
// });

router.get("/dashboard/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await Order.findById(orderId)
      .populate("user")
      .populate("business");

    if (!orders) {
      return res
        .status(404)
        .json({ message: "No Order found", success: false });
    }

    res.status(200).json({ success: true, order: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

router.delete("/dashboard/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "No order found", success: false });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
});

module.exports = router;
