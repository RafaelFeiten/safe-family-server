"use strict";

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.status(200).send({
    title: `Safe Family`,
    version: "1.0.0",
  });
});

module.exports = router;
