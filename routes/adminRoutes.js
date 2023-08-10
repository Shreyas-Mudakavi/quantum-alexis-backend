const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllBusiness,
  deleteAllBusiness,
  getBusiness,
  updateBusiness,
  createNewPackage,
  getAllPackages,
  getPackage,
  updatePackage,
  deletePackage,
  getAllOrders,
  getOrder,
  getBusinessOrder,
  getUserOrder,
  deleteOrder,
  getAllUserBusiness,
  deleteBusiness,
  getStatistics,
} = require("../controllers/adminController");
const { auth, isAdmin } = require("../middlewares/auth");
const {
  createNewAddOnProduct,
  getAllAddOnProducts,
  getAddOnProducts,
  updateAddOnProducts,
  deleteAddOnProducts,
} = require("../controllers/addOnController");

// Admin dashboard route protected with isAdmin middleware
router.get("/statistics/:time", auth, isAdmin, getStatistics);

//----------------------------------------------------users-------------------------------
//---------- /dashboard/users -----------------------

router.get("/dashboard/users", auth, isAdmin, getAllUsers);

//---------- /dashboard/users/new-user -----------------------

// router.post("/dashboard/users/new-user", createNewUser);

//---------- /dashboard/users/:id -----------------------

router.get("/dashboard/users/:id", auth, isAdmin, getUser);

router.patch("/dashboard/users/:id", auth, isAdmin, updateUser);

router.delete("/dashboard/users/:id", auth, isAdmin, deleteUser);

router.get(
  "/dashboard/users/:id/businesses",
  auth,
  isAdmin,
  getAllUserBusiness
);
//--------------------------------business--------------------------------------------------------------------

//---------- /dashboard/users/:id/businesses -----------------------

// router.post("/dashboard/users/:id/businesses/new-business", createNewBusiness);

router.get("/dashboard/businesses", auth, isAdmin, getAllBusiness);

router.get("/dashboard/businesses/:id", auth, isAdmin, getBusiness);

router.delete("/dashboard/businesses/:id", auth, isAdmin, deleteBusiness);

router.patch("/dashboard/businesses/:id", auth, isAdmin, updateBusiness);

// router.delete(
//   "/dashboard/users/:id/businesses/:bid",
//   auth,
//   isAdmin,
//   deleteBusiness
// );

//--------------------------------------------------------- Packages ----------------------------------

//------------------- /dashboard/packages ------------------------------

router.post("/dashboard/packages/new-package", auth, isAdmin, createNewPackage);

router.get("/dashboard/packages", auth, isAdmin, getAllPackages);

router.get("/dashboard/packages/:id", auth, isAdmin, getPackage);

router.patch("/dashboard/packages/:id", auth, isAdmin, updatePackage);

router.delete("/dashboard/packages/:id", auth, isAdmin, deletePackage);

//--------------------------------------------------------- Orders ----------------------------------
//---------------------/dashboard/orders---------------------------------------

router.get("/dashboard/orders", auth, isAdmin, getAllOrders);

router.get("/dashboard/orders/:id", auth, isAdmin, getOrder);

router.delete("/dashboard/orders/:id", auth, isAdmin, deleteOrder);

// router.get("/dashboard/users/:id/businesses/:bid/orders", getBusinessOrder);

// router.get("/dashboard/users/:id/orders", getUserOrder);

router.post("/add-addOn", auth, isAdmin, createNewAddOnProduct);
router.get("/getAll-addOn", auth, isAdmin, getAllAddOnProducts);
router.get("/get-addOn/:id", auth, isAdmin, getAddOnProducts);
router.put("/update-addOn/:id", auth, isAdmin, updateAddOnProducts);
router.delete("/delete-addOn/:id", auth, isAdmin, deleteAddOnProducts);

module.exports = router;
