const express = require("express");
const { body, check } = require("express-validator");
const router = express.Router();
const isLogin = require("../middleware/checkAuth");
const issueController = require("../controller/issueController");





module.exports=router;