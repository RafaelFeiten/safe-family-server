"use strict";
const userActions = require("../actions/user-actions");

exports.authorize = async function(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "Token não informado." });
  }
  const parts = authHeader.split(" ");
  const [scheme, token] = parts;
  let error = await userActions.authTokenUser(token);
  if (error) {
    console.log("Erro token", error);
    return res.status(401).send({ message: error });
  } else {
    console.log("passou");
    next();
  }
};
