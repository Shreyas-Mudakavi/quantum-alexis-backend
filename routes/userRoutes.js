const express = require("express");
const router = express.Router();

const {
  getUserAccount,
  updateUserAccount,
  createNewBusiness,
  getBusinessAccount,
  getAllBusinessAccount,
  updateBusinessAccount,
  getAllOrderHistory,
  getOrderHistory,
  createNewOrder,
  getBusinessOrderHistory,
} = require("../controllers/userController");
const { getAddOnProductBelongsTo } = require("../controllers/addOnCOntroller");
const { auth } = require("../middlewares/auth");
//const { auth } = require('../middlewares/authMiddleware');

router.get("/addOns", getAddOnProductBelongsTo);

//---------------------User--------------------//

//user account settings GET

router.get("/dashboard/account-settings", auth, getUserAccount);

//user account setting PATCH

router.patch("/dashboard/account-settings", auth, updateUserAccount);

//--------------------Business----------------------//

//user business-settings Post

router.post(
  "/dashboard/business-settings/new-business",
  auth,
  createNewBusiness
);

//user business-settings GET

router.get("/dashboard/business-settings", auth, getAllBusinessAccount);

router.get("/dashboard/business-settings/:bid", auth, getBusinessAccount);

//user business-settings PATCh

router.patch("/dashboard/business-settings/:bid", auth, updateBusinessAccount);

router.get("/dashboard/order-history/:bid", auth, getAllOrderHistory);

router.get("/dashboard/order-history/:oid", auth, getOrderHistory);

router.get(
  "/dashboard/business-settings/:bid/orders",
  auth,
  getBusinessOrderHistory
);

//----for placing new orders for a particular business------

router.post("/dashboard/new-order/:bid", auth, createNewOrder);

module.exports = router;
