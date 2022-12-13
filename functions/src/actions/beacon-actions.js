"use strict";
const firebase = require("firebase-admin");
const firestore = firebase.firestore;

const getBeaconById = async (id) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("beacons")
      .doc(id)
      .get()
      .then((snapshot) => {
        resolve(snapshot.data());
      })
      .catch((e) => {
        reject(e);
      });
  });
};

// EXPORT
module.exports = {
  getBeaconById,
};
