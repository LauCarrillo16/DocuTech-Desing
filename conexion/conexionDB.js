const mongoose = require("mongoose");

const conexion =
  "mongodb+srv://carrillolaura:7jvj8tOLNkcBGRya@clusterdocutech.np0xywh.mongodb.net/NewArq?retryWrites=true&w=majority";
mongoose
  .connect(conexion)
  .then(() => console.log("Conectado a mongoDB Docutech -> newArq by JDFM"))
  .catch((error) => console.log("Error al conectar a mongo:", error));

module.exports = mongoose;
