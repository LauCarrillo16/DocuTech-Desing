const mongoose = require("mongoose");

const auditoriaSchema = new mongoose.Schema(
    {
        descripcion: {
            type: String,
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
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
    },
    { versionKey: false }
);

const Auditoria = mongoose.model("Auditoria", auditoriaSchema);

module.exports = Auditoria;