"use strict";
const firebase = require("firebase-admin");
const firestore = firebase.firestore;

const saveNewChat = (model, descricao, imagem) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`chat`)
      .add(model)
      .then((doc) => {
        let model = {
          texto: `Ajude a encontrar este utilizador!\nCaso você o aviste, informe neste chat para contatar seu responsável e ajudar para que ele seja mais rapidamente encontrado.`,
          autor: "sistema",
          data: new Date().getTime(),
          nome: `Plataforma Safe Family`,
        };

        firestore()
          .collection(`chat/${doc.id}/mensagens`)
          .add(model)
          .then(() => {
            if (descricao || imagem) {
              let model = {
                autor: "sistema",
                data: new Date().getTime(),
                nome: `Plataforma Safe Family`,
                imagem: imagem || null,
                texto: descricao || null,
              };
              firestore()
                .collection(`chat/${doc.id}/mensagens`)
                .add(model)
                .then(() => {
                  resolve(false);
                })
                .catch(function (error) {
                  resolve(error);
                });
            } else {
              resolve(false);
            }
          })
          .catch(function (error) {
            resolve(error);
          });
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

const getUsers = async () => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users`)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) resolve([]);
        let users = snapshot.docs.map((doc) => {
          return { uid: doc.id, ...doc.data() };
        });
        resolve(users);
      })
      .catch((error) => {
        console.log("error", error);
        resolve(false);
      });
  });
};

const getChatsById = async (chatID) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`chat`)
      .where("chatID", "==", chatID)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) resolve([]);
        let chats = snapshot.docs.map((doc) => {
          return { uid: doc.id, ...doc.data() };
        });
        resolve(chats);
      })
      .catch((error) => {
        console.log("error", error);
        resolve(false);
      });
  });
};

const saveEncontrado = (id) => {
  let model = {
    texto: `Este utilizador foi encontrado, obrigado por sua ajuda!`,
    autor: "sistema",
    data: new Date().getTime(),
    nome: `Plataforma Safe Family`,
  };

  return new Promise((resolve, reject) => {
    firestore()
      .collection(`chat/${id}/mensagens`)
      .add(model)
      .then(() => {
        firestore()
          .collection(`chat`)
          .doc(id)
          .update({ ativo: false, ultimaMensagem: new Date().getTime() })
          .then(() => {
            resolve(false);
          })
          .catch(function (error) {
            resolve(error);
          });
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

// EXPORT
module.exports = {
  saveEncontrado,
  saveNewChat,
  getUsers,
  getChatsById,
};
