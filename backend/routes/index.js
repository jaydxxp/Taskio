const express = require("express");
const LoginRouter = require("./login");
const SignupRouter = require("./signup"); 
const TaskRouter = require("./task");

const router = express.Router();

router.use("/user", LoginRouter);
router.use("/user", SignupRouter);
router.use("/task", TaskRouter);


module.exports = router;