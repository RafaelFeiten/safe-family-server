"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/utilizador-controller");
const authService = require("../services/auth-service");

router.post("/image/post", authService.authorize, controller.saveImage);

router.post("/image/get", authService.authorize, controller.getImage);

router.post("/image/delete", authService.authorize, controller.deleteImage);

router.post(
  "/notificar/perdido",
  authService.authorize,
  controller.notificarPerdido
);

router.post(
  "/notificar/encontrado",
  authService.authorize,
  controller.notificarEncontrado
);

router.post(
  "/notificar/mensagem",
  authService.authorize,
  controller.notificarMensagem
);

router.post(
  "/notificar/visualizado",
  authService.authorize,
  controller.notificarVisualizado
);

module.exports = router;
