"use strict";
const firebase = require("firebase-admin");
const firestore = firebase.firestore;

const updateImage = (uid, imagem) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`utilizadores`)
      .doc(uid)
      .update({ imagem })
      .then(() => {
        resolve(false);
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

const updateBeacon = async (id, atributo, valor) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("beacons")
      .doc(id)
      .update({
        [atributo]: valor,
      })
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

const updateUtilizador = async (id, atributo, valor) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .doc(id)
      .update({
        [atributo]: valor,
      })
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        console.log("e", e);
        resolve(e);
      });
  });
};

const getUtilizadores = async () => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`utilizadores`)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) resolve([]);
        let utilizadores = snapshot.docs.map((doc) => {
          return { uid: doc.id, ...doc.data() };
        });
        resolve(utilizadores);
      })
      .catch((error) => {
        console.log("error", error);
        resolve(false);
      });
  });
};

const getUtilizador = async (id) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`utilizadores`)
      .doc(id)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) resolve(false);
        resolve({ uid: snapshot.id, ...snapshot.data() });
      })
      .catch((error) => {
        console.log("error", error);
        resolve(false);
      });
  });
};

// EXPORT
module.exports = {
  updateImage,
  updateBeacon,
  getUtilizadores,
  updateUtilizador,
  getUtilizador,
};
