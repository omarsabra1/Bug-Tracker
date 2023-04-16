const mongoose = require("mongoose");

const Comment = require("../model/comment");
const Issues = require("../model/issues");
const comment = require("../model/comment");

exports.deleteComment = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  try {
    if (!mongoose.Types.ObjectId.isValid(comment_id)) {
      const error = new Error("id not accepted");
      error.statusCode = 406;
      return next(error);
     }
     const comment = await Comment.findById(comment_id);
     if(!comment){
      const error = new Error("comment not found");
      error.statusCode = 404;
      return next(error);
     }
     if(comment.author.toString() !== req.userId){
       const error = new Error("not accepted to delete");
       error.statusCode = 406;
       return next(error);
     }
    await Comment.deleteOne({ _id: comment_id});
     res.status(200).json({
      status:true
     })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

exports.updateComment = async (req, res, next) => {
  const { content } = req.body;
  const comment_id = req.params.comment_id;
  try {
    const comment = await Comment.findById(comment_id);
    if (comment.author.toString() !== req.userId) {
      const error = new Error("not accepted to edit");
      error.statusCode = 406;
      return next(error);
    }
    comment.content = content;
    await comment.save();
    res.status(200).json({
      comment: comment,
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

exports.createReplyCommemt = async (req, res, next) => {
  const comment_id = req.params.parent_id;

  try {
    if (mongoose.Types.ObjectId.isValid(comment_id)) {
      const parent_comment = await Comment.findById(comment_id);
      if (!parent_comment) {
        const error = new Error("parent comment not found");
        error.statusCode = 404;
        return next(error);
      }
      const replyContent = new Comment({
        author: new mongoose.Types.ObjectId(req.userId),
        content: req.body.content,
        issue_id: parent_comment.issue_id,
      });
      if (replyContent.content === "" || replyContent.content === undefined) {
        const error = new Error("content is Empty");
        error.statusCode = 404;
        return next(error);
      }
      parent_comment.reply.push(replyContent._id);
      await parent_comment.save();
      const saveNewComment = await replyContent.save();
      res.status(201).json({
        comment: saveNewComment,
        status: true,
      });
    } else {
      const error = new Error("id not accpeted");
      error.statusCode = 400;
      return next(error);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

exports.createComment = async (req, res, next) => {
  const { content } = req.body;
  const issue_id = req.params.id;
  try {
    if (content === "" || content === undefined) {
      const error = new Error("comment empty");
      error.statusCode = 400;
      return next(error);
    }
    if (mongoose.Types.ObjectId.isValid(issue_id)) {
      const issue = await Issues.findById(issue_id);
      if (!issue) {
        const error = new Error("issue not found");
        error.statusCode = 404;
        return next(error);
      }
    } else {
      const error = new Error("id not accpeted");
      error.statusCode = 400;
      return next(error);
    }

    const comment = await Comment.create({
      author: new mongoose.Types.ObjectId(req.userId),
      issue_id: new mongoose.Types.ObjectId(issue_id),
      content: content,
    });
    res.status(201).json({
      comment: comment,
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

exports.getReplyComment = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  try {
    const comment = await Comment.findById(comment_id).populate("reply");
    if (!comment) {
      const error = new Error("comment not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      reply_comment: comment,
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};

exports.getComment = async (req, res, next) => {
  const issue_id = req.params.issue_id;
  try {
    if (mongoose.Types.ObjectId.isValid(issue_id)) {
      const issue = await Issues.findById(issue_id);
      if (!issue) {
        const error = new Error("author not found");
        error.statusCode = 404;
        return next(error);
      }
      const comment = await Comment.findOne({ issue_id: issue_id });
      res.status(200).json({
        comments: comment,
        status: true,
      });
    } else {
      const error = new Error("id not (found / accepted)");
      error.statusCode = 404;
      return next(error);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};
