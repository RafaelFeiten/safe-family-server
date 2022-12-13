"use strict";

const storageServices = require("../services/storage-services");
const utilizadoresAction = require("../actions/utilizador-actions");
const userAction = require("../actions/user-actions");
const chatAction = require("../actions/chat-actions");
const beaconAction = require("../actions/beacon-actions");
const utils = require("../services/index");
const onesignal = require("../services/onesignal");

exports.saveImage = async (req, res, next) => {
  try {
    const { content, caminho, utilizador } = req.body;
    if (!content || !caminho || !utilizador) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }
    let { error, message } = await storageServices.uploadArchive(
      content,
      caminho
    );
    if (error) {
      return res.status(400).send({ message });
    }
    let erro = await utilizadoresAction.updateImage(utilizador, message);
    if (erro) {
      return res.status(400).send({
        message: "Erro ao salvar imagem no Firestore.",
      });
    }
    return res.status(200).send({
      message: "Inserção no Storage concluída com sucesso!",
    });
  } catch (e) {
    console.log("erro image", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const { caminho } = req.body;
    if (!caminho) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }

    let { error, message } = await storageServices.getArchive(caminho);
    if (error) {
      return res.status(400).send({ message });
    }

    let content = message;
    let name = storageServices.getFileName(caminho);
    res.status(200).send({ name, content });
  } catch (e) {
    console.log("erro image", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { caminho, utilizador } = req.body;
    if (!caminho || !utilizador) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }

    let { error, message } = await storageServices.deleteArchive(caminho);
    if (error) {
      return res.status(400).send({ message });
    }

    let erro = await utilizadoresAction.updateImage(utilizador, "");
    if (erro) {
      return res.status(400).send({
        message: "Erro ao deletar imagem no Firestore.",
      });
    }

    res.status(200).send({ message });
  } catch (e) {
    console.log("erro image", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};

exports.notificarPerdido = async (req, res, next) => {
  try {
    const {
      location,
      utilizador,
      beaconID,
      owner,
      descricao,
      imagem,
    } = req.body;
    if (!utilizador) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }

    let error = await utilizadoresAction.updateBeacon(
      beaconID,
      "status",
      "perdido"
    );
    if (error) {
      return res.status(400).send({ message: error });
    }

    let users = await userAction.getUsers();
    if (!users) {
      return res.status(400).send({ message: error });
    }
    let usersProximos = [];
    users.map((user) => {
      let { lastLocation } = user;
      if (lastLocation) {
        let distancia = utils.getDistance(location, lastLocation);
        if (distancia <= 5000 && user.uid !== owner) {
          usersProximos.push(user.uid);
        }
      }
    });

    if (usersProximos.length > 0) {
      let chatID = new Date().getTime();

      await utilizadoresAction.updateUtilizador(utilizador, "chatID", chatID);

      await Promise.all(
        usersProximos.map(async (user) => {
          let time = new Date().getTime();
          let model = {
            ativo: true,
            envolvidos: [user, owner],
            created: time,
            ultimaMensagem: time,
            chatID,
            owner,
          };
          await chatAction.saveNewChat(model, descricao, imagem);
          let title = "Plataforma Safe Family";
          let body = "Ajude a encontrar um utilizador!";
          await onesignal.notificationByParam(
            title,
            body,
            "user",
            user,
            "ajudar"
          );
        })
      );
    }

    return res.status(200).send({ message: "Sucesso." });
  } catch (e) {
    console.log("erro ", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};

exports.notificarEncontrado = async (req, res, next) => {
  try {
    const { utilizador, beaconID } = req.body;
    if (!utilizador && !beaconID) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }

    let error = await utilizadoresAction.updateBeacon(
      beaconID,
      "status",
      "normal"
    );
    if (error) {
      return res.status(400).send({ message: error });
    }

    let utilizadorData = await utilizadoresAction.getUtilizador(utilizador);
    let { chatID } = utilizadorData;

    if (chatID) {
      let chats = await chatAction.getChatsById(chatID);

      if (chats.length > 0) {
        await Promise.all(
          chats.map(async (chat) => {
            await chatAction.saveEncontrado(chat.uid);
            let title = "Plataforma Safe Family";
            let body = "O Utilizador foi encontrado! Obrigado pela sua ajuda!";
            await onesignal.notificationByParam(
              title,
              body,
              "user",
              chat.envolvidos[0]
            );
          })
        );
      }

      await utilizadoresAction.updateUtilizador(utilizador, "chatID", null);
    }

    return res.status(201).send({ message: "Sucesso." });
  } catch (e) {
    console.log("erro ", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};

exports.notificarVisualizado = async (req, res, next) => {
  try {
    const { beaconID } = req.body;
    if (!beaconID) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }

    let { owner } = await beaconAction.getBeaconById(beaconID);
    if (!owner) {
      return res.status(400).send({ message: "erro ao buscar beacon" });
    }

    let title = "Plataforma Safe Family";
    let body =
      "Seu Utilizador foi localizado, clique abaixo para visualizar o local!";
    onesignal.notificationByParam(title, body, "user", owner, "visualizar");
    return res.status(201).send({ message: "Sucesso." });
  } catch (e) {
    console.log("erro ", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};

exports.notificarMensagem = async (req, res, next) => {
  try {
    const { owner } = req.body;
    if (!owner) {
      return res.status(400).send({
        message: "Dados obrigatórios não informado.",
      });
    }

    let title = "Plataforma Safe Family";
    let body = "Você possui uma nova mensagem.";
    onesignal.notificationByParam(title, body, "user", owner, "responder");
    return res.status(201).send({ message: "Sucesso." });
  } catch (e) {
    console.log("erro ", e);
    res.status(500).send({
      message: "Falha ao processar sua requisição.",
    });
  }
};
