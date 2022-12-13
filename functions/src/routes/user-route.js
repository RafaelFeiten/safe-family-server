"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const authService = require("../services/auth-service");

router.put(
  "/update/email/:novoEmail",
  authService.authorize,
  controller.updateEmail
);

router.put(
  "/update/senha/:novaSenha",
  authService.authorize,
  controller.updateSenha
);

router.delete("/", authService.authorize, controller.deleteUser);

module.exports = router;
