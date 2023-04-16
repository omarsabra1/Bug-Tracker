require('dotenv')
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const { validationResult } = require("express-validator");

const SALT = 10;
exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = validationResult(req);
  try {
      if (!errors.isEmpty()) {
        const error = new Error("validation faild");
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, SALT);
      const checkUser = await User.findOne({ email: email });
      if (checkUser) {
        const error = new Error("email found");
        error.statusCode = 401;
        error.data = { message: "email is founded in database" };
        return next(error);
      }
      const user = await User.create({
        name: name,
        password: hashedPassword,
        email: email,
      });
      res.status(201).json({
        message:"user created",
        status: true,
      })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("validation faild");
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const user = await User.findOne({email:email})
    if (!user) {
      const error = new Error("Email not found");
      error.statusCode = 401;
      return next(error);
    }
    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      const error = new Error(" Wrong password ");
      error.statusCode = 401;
      return next(error);
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWTSECERT,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      user: user.name,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};