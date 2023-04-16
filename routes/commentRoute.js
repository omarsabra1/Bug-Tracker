const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const isLogin = require("../middleware/checkAuth");
const commentController = require("../controller/commentController");

//create comment
router.post("/new/:id", isLogin, commentController.createComment);

// create reply comment
router.post("/reply/:parent_id", isLogin, commentController.createReplyCommemt);

// get coomment
router.get("/get/:issue_id", commentController.getComment);
// get reply comment
router.get("/reply/:comment_id", commentController.getReplyComment);
// update comment
router.put("/update/:comment_id", isLogin, commentController.updateComment);
// delete comment
router.delete("/delete/:comment_id", isLogin, commentController.deleteComment);
module.exports = router;
