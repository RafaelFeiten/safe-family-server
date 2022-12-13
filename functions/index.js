const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase-admin");
const app = express();
const config = require("./firebaseArchives/tccsafefamily.json");

// Conectando Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(config),
  databaseURL: "https://tccsafefamily.firebaseio.com",
});

// Carrega as Rotas
const indexRoute = require("./src/routes/index-route");
const userRoute = require("./src/routes/user-route");
const utilizadorRoute = require("./src/routes/utilizador-route");

app.use("/index", indexRoute);
app.use("/user", userRoute);
app.use("/utilizador", utilizadorRoute);

if (functions.config().environment) {
  const cronJob = require("./src/services/cron-job-service");
  exports.scheduleV1 = functions
    .runWith({
      timeoutSeconds: 530,
      memory: "2GB",
    })
    .pubsub.schedule("every 5 minutes")
    .onRun(async (context) => {
      await cronJob.executarFila();
    });
}

exports.serverv1 = functions
  .runWith({
    timeoutSeconds: 530,
    memory: "2GB",
  })
  .https.onRequest(app);

console.log(`========RUNNING========`);
