"use strict";
//IMPORTS
const firebase = require("firebase-admin");
const utils = require("../services");
const firestore = firebase.firestore;

// FUNCOES FIREBASE
const saveFila = data => {
  data = { ...data, created: utils.getCurrentTime(), tentativas: 0 };
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`fila`)
      .add(data)
      .then(snapshot => {
        console.log("snapshot.id", snapshot.id);
        resolve(false);
      })
      .catch(error => {
        resolve(error);
      });
  });
};

const getFila = () => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`fila`)
      .get()
      .then(snapshot => {
        if (snapshot.empty) resolve([]);
        let emails = snapshot.docs.map(doc => {
          let data = { filaID: doc.id, ...doc.data() };
          return data;
        });
        resolve(emails);
      })
      .catch(error => {
        resolve(error);
      });
  });
};

const updateTentativaFila = (filaID, tentativas) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`fila`)
      .doc(filaID)
      .update({ tentativas: tentativas + 1 })
      .then(() => {
        resolve();
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

const deleteFila = (filaID, element) => {
  let data = { ...element, resolvida: utils.getCurrentTime() };
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`filaResolvida`)
      .doc(filaID)
      .set(data)
      .then(() => {
        firestore()
          .collection(`fila`)
          .doc(filaID)
          .delete()
          .then(() => {
            resolve(false);
          })
          .catch(function(error) {
            resolve(error);
          });
      })
      .catch(function(error) {
        resolve(error);
      });
  });
};

// EXPORT
module.exports = {
  saveFila,
  getFila,
  updateTentativaFila,
  deleteFila
};
