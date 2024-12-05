const admin = require("firebase-admin");

const serviceAccount = require("../firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://note-app-b383b-default-rtdb.firebaseio.com/",
});

const db = admin.database();

module.exports = db;
