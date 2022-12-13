const { Storage } = require("@google-cloud/storage");

const getExtension = (data) => {
  let parts = data.split(".");
  let extensao = parts[parts.length - 1];
  return extensao;
};

const getFileName = (data) => {
  let parts = data.split("/");
  let name = parts[parts.length - 1];
  return name;
};

const getBucket = async () => {
  const storage = new Storage({
    projectId: "tccsafefamily",
    keyFilename: "./firebaseArchives/tccsafefamily.json",
  });
  const bucket = await storage.bucket("tccsafefamily.appspot.com");
  return bucket;
};

const uploadArchive = async (content, caminhoCompleto) => {
  try {
    const bucket = await getBucket();

    const file = bucket.file(caminhoCompleto);
    const extensao = getExtension(caminhoCompleto);
    var buff = Buffer.from(content, "base64");
    return new Promise((resolve, reject) => {
      file
        .save(buff, {
          metadata: {
            contentType: `application/${extensao}`,
          },
        })
        .then(() => {
          resolve({ error: false, message: caminhoCompleto });
        })
        .catch((err) => {
          resolve({ error: true, message: err });
        });
    });
  } catch (e) {
    return { error: true, message: e.toString() };
  }
};

const getArchive = async (arquivo) => {
  try {
    const bucket = await getBucket();

    const file = bucket.file(arquivo);
    const extensao = getExtension(arquivo);

    return new Promise((resolve, reject) => {
      file
        .download({
          metadata: {
            contentType: `application/${extensao}`,
          },
        })
        .then((file) => {
          resolve({
            error: false,
            message: Buffer.from(file[0]).toString("base64"), //Retorna base64
          });
        })
        .catch((err) => {
          resolve({ error: true, message: err });
        });
    });
  } catch (e) {
    return { error: true, message: e.toString() };
  }
};

const deleteArchive = async (arquivo) => {
  try {
    const bucket = await getBucket();
    const file = bucket.file(arquivo);
    return new Promise((resolve, reject) => {
      file
        .delete()
        .then((file) => {
          resolve({
            error: false,
            message: "Arquivo deletado.",
          });
        })
        .catch((err) => {
          resolve({ error: true, message: err });
        });
    });
  } catch (e) {
    return { error: true, message: e.toString() };
  }
};

module.exports = {
  uploadArchive,
  getExtension,
  getArchive,
  getFileName,
  deleteArchive,
};
