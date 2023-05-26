const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Auditoria = require("../modelos/auditorias");

router.use(bodyParser.json());


// Cargar todas las auditorias (READ)
router.get("/totalAuditorias", async (req, res) => {
  try {
    const auditorias = await Auditoria.find({});
    if (auditorias.length > 0) {
      res.json(auditorias);
    } else {
      res.status(404).send("No se encontraron auditorias");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Crear una auditoria servicio *FUNCIONAL*
router.post("/newAuditoria", async (req, res) => {
  try {
    const {
      descripcion,
      usuario,
    } = req.body;

    const newDate = new Date();

    const newAudit = new Auditoria({
      descripcion: descripcion,
      fecha: newDate,
      usuario: {
        usuario: usuario.usuario,
        password: usuario.password,
        idrol: usuario.idrol,
        idusuario: usuario.idusuario,
        nombre: usuario.nombre,
        estado: usuario.estado,
        correo: usuario.correo,
      },
    });

    await newAudit.save();

    res.json("Se ha insertado correctamente la auditoria");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
