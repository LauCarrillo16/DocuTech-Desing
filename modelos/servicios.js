const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema(
  {
    idservicio: {
      type: Number,
      unique: true,
      required: true,
    },
    comentariosentrada: {
      type: String,
    },
    marca: {
      type: String,
      required: true,
    },
    tipodispositivo: {
      type: String,
      required: true,
    },
    modelo: {
      type: String,
    },
    numeroserie: {
      type: String,
    },
    estado: {
      type: String,
      required: true,
    },
    comentariossalida: {
      type: String,
    },
    ram: {
      type: String,
    },
    tipodisco: {
      type: String,
    },
    fechaentrada: {
      type: Date,
      required: true,
    },
    fechasalida: {
      type: Date,
    },
    usuario: {
      type: {
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
      required: true,
    },
    fechaasignacionT: {
      type: Date,
    },
    fechafinalizacionT: {
      type: Date,
    },
    tecnico: {
      type: {
        usuario: {
          type: String,
        },
        password: {
          type: String,
        },
        idrol: {
          type: Number,
        },
        idusuario: {
          type: Number,
        },
        nombre: {
          type: String,
        },
        estado: {
          type: Boolean,
        },
        correo: {
          type: String,
        },
      },
    },
  },
  { versionKey: false }
);

const Servicio = mongoose.model("Servicio", servicioSchema);

module.exports = Servicio;