const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Issue = require("../model/issues");
exports.createIssue = async (req, res, next) => {
  const { title, description, priority, project_id } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("validation faild");
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }
    const issue = await Issue.create({
      title: title,
      description: description || null,
      priority: priority || null,
      assigned_to: new mongoose.Types.ObjectId(req.userId),
      project_id: new mongoose.Types.ObjectId(project_id),
    });
    res.status(201).json({
      message: "issue created",
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getIssue = async (req, res, next) => {
  try {
    const issue = await Issue.find().populate("assigned_to");
    res.status(200).json({
      issues: issue,
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateIssue = async (req, res, next) => {
  const { title, description, priority, status, project_id } = req.body;
  const issue_id = req.params.id;
  try {
    const issue = await Issue.findById(issue_id);
    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.priority = priority || issue.priority;
    issue.status = status || issue.status;
    issue.project_id = project_id || issue.project_id;
    await issue.save();
    res.status(200).json({
      issue: issue,
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteIssue = async (req, res, next) => {
  const issue_id = req.params.id;
  try {
    if (mongoose.Types.ObjectId.isValid(issue_id)) {
      const issue = await Issue.findById(issue_id);
      if (!issue) {
        res.status(406).json({
          message: "issue not found",
          status: false,
        });
      }
    } else {
      res.status(406).json({
        message: "id not found",
        status: false,
      });
    }
    await Issue.deleteOne({ _id: issue_id });
    res.status(200).json({
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
