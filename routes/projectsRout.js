const express = require("express");
const { body, check } = require("express-validator");
const router = express.Router();
const isLogin = require("../middleware/checkAuth");
const projectsController = require("../controller/projectsController");

router.post(
  "/newproject",
  isLogin,
  projectsController.createProject
);

module.exports = router;
