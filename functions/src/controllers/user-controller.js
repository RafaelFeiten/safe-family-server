"use strict";

const authService = require("../services/auth-service");
const userActions = require("../actions/user-actions");
const filaActions = require("../actions/fila-actions");
const actions = require("../services");

exports.updateEmail = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(" ");
    const [scheme, token] = parts;
    let { uid } = await userActions.getUserID(token);

    if (!uid) {
      return res.status(400).send({
        message: "Falha ao buscar o usuário."
      });
    }
    let { novoEmail } = req.params;
    let erroUpdate = await userActions.updateUserOnAuth(uid, novoEmail);
    if (erroUpdate) {
      return res.status(400).send({
        message: "Falha ao atualizar o usuário.",
        erro: erroUpdate
      });
    }

    let erroUpdateFire = await userActions.updateUser(uid, novoEmail);
    if (erroUpdateFire) {
      let filaModel = {
        action: 1,
        uid,
        novoEmail
      };
      await filaActions.saveFila(filaModel);
    }

    return res.status(200).send({
      message: "Update realizado com sucesso."
    });
  } catch (e) {
    console.log("erro geral updateEmail");
    console.log(e);

    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};

exports.updateSenha = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(" ");
    const [scheme, token] = parts;
    let { uid } = await userActions.getUserID(token);
    if (!uid) {
      return res.status(400).send({
        message: "Falha ao buscar o usuário."
      });
    }

    let { novaSenha } = req.params;
    let erroUpdate = await userActions.updatePasswordOnAuth(uid, novaSenha);
    if (erroUpdate) {
      return res.status(400).send({
        message: "Falha ao atualizar o usuário.",
        erro: erroUpdate
      });
    }

    return res.status(200).send({
      message: "Update realizado com sucesso."
    });
  } catch (e) {
    console.log("erro geral updateSenha");
    console.log(e);
    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(" ");
    const [scheme, token] = parts;
    let { uid } = await userActions.getUserID(token);
    if (!uid) {
      return res.status(400).send({
        message: "Falha ao buscar o usuário."
      });
    }

    let erroUpdate = await userActions.deleteUserOnAuth(uid);
    if (erroUpdate) {
      return res.status(400).send({
        message: "Falha ao excluir o usuário.",
        erro: erroUpdate
      });
    }

    let filaModel = {
      action: 2,
      uid
    };
    await filaActions.saveFila(filaModel);

    return res.status(200).send({
      message: "Exclusão realizada."
    });
  } catch (e) {
    console.log("erro geral deleteUser");
    console.log(e);
    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};
