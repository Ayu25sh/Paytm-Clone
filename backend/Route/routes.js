const express = require("express");
const router = express.Router();
const {signup,login,updateProfile,getByName} = require("../controllers/Auth");
const {getBalance,transfer} = require("../controllers/Account");
const {auth} = require("../middleware/Auth");

router.post("/login",login);
router.post("/signup",signup);
router.post("/updateProfile",auth,updateProfile);
router.get("/get-by-string",getByName)

router.get("/get-balance",auth,getBalance);
router.put("/transfer",auth,transfer);

module.exports = router;