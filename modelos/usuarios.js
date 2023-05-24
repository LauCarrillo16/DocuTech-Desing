const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    idrol: {
      type: Number,
      required: true,
    },
    idusuario: {
      type: Number,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      required: true,
    },
    correo: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
