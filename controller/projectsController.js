const { validationResult } = require("express-validator");
const Project = require("../model/project");

exports.createProject = async (req, res, next) => {
  const { name, description } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("validation faild");
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }
    const checkProject = await Project.findOne({ name: name });
    if (checkProject) {
      const error = new Error("name found");
      error.statusCode = 406;
      error.data = { message: "name is founded in database" };
      return next(error);
    }
    const newProject = await Project.create({
      name: name,
      description: description || null,
    });
    res.status(201).json({
      message: "project created",
      status: true,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
  }
};
