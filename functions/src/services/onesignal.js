const sendNotification = (data) => {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic ...",
  };
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  var req = https.request(options, function (res) {
    res.on("data", function (data) {});
  });
  req.write(JSON.stringify(data));
  req.end();
};

const notificationAll = (title, body) => {
  let message = {
    app_id: "",
    headings: { en: title },
    contents: { en: body },
    included_segments: ["All"],
  };

  sendNotification(message);
};

const notificationByParam = (title, body, param, value, button) => {
  var message = {
    app_id: "",
    headings: { en: title },
    contents: { en: body },
    buttons: button ? [{ id: button, text: button.toUpperCase() }] : [],
    filters: [{ field: "tag", key: param, relation: "=", value: value }],
  };

  sendNotification(message);
};

module.exports = { sendNotification, notificationAll, notificationByParam };
