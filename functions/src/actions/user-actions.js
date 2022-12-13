"use strict";
const firebase = require("firebase-admin");
const firestore = firebase.firestore;
const auth = firebase.auth();

const getUserByID = (userID) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users`)
      .doc(userID)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) resolve(false);
        resolve(snapshot.data());
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const updateUser = (uid, email) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users`)
      .doc(uid)
      .update({ email })
      .then(() => {
        resolve(false);
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

const authTokenUser = async (idToken) => {
  return new Promise((resolve, reject) => {
    auth
      .verifyIdToken(idToken, true)
      .then((payload) => {
        resolve(false);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

const getUserID = async (idToken) => {
  return new Promise((resolve, reject) => {
    auth
      .verifyIdToken(idToken, true)
      .then((payload) => {
        resolve(payload);
      })
      .catch((error) => {
        resolve(false);
      });
  });
};

const getUserOnAuth = async (uid) => {
  return new Promise((resolve, reject) => {
    auth
      .getUser(uid)
      .then(function (userRecord) {
        resolve(userRecord);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const updateUserOnAuth = async (uid, email) => {
  return new Promise((resolve, reject) => {
    auth
      .updateUser(uid, {
        email,
        emailVerified: false,
      })
      .then(function (userRecord) {
        resolve(false);
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

const updatePasswordOnAuth = async (uid, password) => {
  return new Promise((resolve, reject) => {
    auth
      .updateUser(uid, {
        password,
      })
      .then(function (userRecord) {
        resolve(false);
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

const deleteUserOnAuth = async (uid, password) => {
  return new Promise((resolve, reject) => {
    auth
      .deleteUser(uid)
      .then(() => {
        resolve(false);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

const deleteUser = async (uid) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users`)
      .doc(uid)
      .delete()
      .then(() => {
        resolve(false);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

const getUserHistoricIds = async (uid) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users/${uid}/historico_login`)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) resolve([]);
        let documentos = snapshot.docs.map((doc) => {
          return doc.id;
        });
        resolve(documentos);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

const deleteUserHistoric = async (uid, doc) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users/${uid}/historico_login`)
      .doc(doc)
      .delete()
      .then((snapshot) => {
        resolve(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// EXPORT
module.exports = {
  getUserByID,
  authTokenUser,
  getUserID,
  getUserOnAuth,
  updateUserOnAuth,
  updateUser,
  updatePasswordOnAuth,
  deleteUserOnAuth,
  deleteUser,
  getUserHistoricIds,
  deleteUserHistoric,
  getUsers,
};
