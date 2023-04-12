const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const isLogin = require("../middleware/checkAuth");
const issueController = require("../controller/issueController");
// new Issue
router.post(
  "/createissue",
  [check("title").isLength({ min: 4 })],
  isLogin,
  issueController.createIssue
);

// get Issues
router.get("/issues", issueController.getIssue);

// update Issue
router.put("/issue/:id", isLogin, issueController.updateIssue);

// delete Issue
router.delete("/issue/:id", isLogin, issueController.deleteIssue);
module.exports = router;
