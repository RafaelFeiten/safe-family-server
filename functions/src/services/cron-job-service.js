const utils = require(".");
const userActions = require("../actions/user-actions");
const filaActions = require("../actions/fila-actions");

const executarFila = async () => {
  try {
    let fila = await filaActions.getFila();
    if (fila.length > 0) {
      await Promise.all(
        fila.map(async element => {
          let type = element.action;
          if (element.tentativas < 10) {
            switch (type) {
              case 1:
                await updateUserOnFirestore(element);
                break;
              case 2:
                await deleteUserOnFirestore(element);
                break;
            }
          }
        })
      );
    }
    return fila;
  } catch (e) {
    console.log("erro fila: ");
    console.log(e);
    return false;
  }
};

//ACTION 1
const updateUserOnFirestore = async element => {
  const { uid, novoEmail, tentativas, filaID } = element;
  try {
    let erro = await userActions.updateUser(uid, novoEmail);
    if (erro) {
      await filaActions.updateTentativaFila(filaID, tentativas);
    } else {
      await filaActions.deleteFila(filaID, element);
    }
  } catch (e) {
    await filaActions.updateTentativaFila(filaID, tentativas);
  }
};

//ACTION 2
const deleteUserOnFirestore = async element => {
  const { uid, tentativas, filaID } = element;
  try {
    //Deleta todo o historico de login
    let documentos = await userActions.getUserHistoricIds(uid);

    if (documentos.length > 0) {
      await Promise.all(
        documentos.map(async doc => {
          await userActions.deleteUserHistoric(uid, doc);
        })
      );
    }

    //Deleta o usuário principal
    let erro = await userActions.deleteUser(uid);
    if (erro) {
      await filaActions.updateTentativaFila(filaID, tentativas);
    } else {
      await filaActions.deleteFila(filaID, element);
    }
  } catch (e) {
    await filaActions.updateTentativaFila(filaID, tentativas);
  }
};

module.exports = {
  executarFila
};
