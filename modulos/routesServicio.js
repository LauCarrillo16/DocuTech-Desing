const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Servicio = require("../modelos/servicios");
const Usuario = require("../modelos/usuarios");

router.use(bodyParser.json());

//Cargar TODOS los SERVICIOS (READ)  *FUNCIONAL*
router.get("/totalServicios", async (req, res) => {
  try {
    const servicios = await Servicio.find({});
    if (servicios.length > 0) {
      res.json(servicios);
    } else {
      res.status(404).send("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Cargar SERVICIOS en COLA (READ) *FUNCIONAL**
router.get('/servicioEnCola', async (req, res) => {
  try {
    const estado = "En cola";
    const serviciosEnCola = await Servicio.find({ estado: estado });
    if (serviciosEnCola.length > 0) {
      res.json(serviciosEnCola);
    } else {
      res.status(404).send("No se encontraron servicios en cola");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


//Cargar SERVICIO ESPECIFICO (READ) *FUNCIONAL**
router.get("/servicioEspecifico/:idservicio", async (req, res) => {
  try {
    const idservicioF = parseInt(req.params.idservicio);
    const servicioEspecifico = await Servicio.findOne({ idservicio: idservicioF });
    if (servicioEspecifico) {
      res.json(servicioEspecifico);
    } else {
      res.status(404).send("No se encontró el servicio especificado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Cargar SERVICIO en MANTENIMIENTO de un USUARIO (READ) *FUNCIONAL**
router.get("/serviciosUsuario/:idusuario", async (req, res) => {
  try {
    const idusuarioF = parseInt(req.params.idusuario);
    const estado = ["Listo para entregar", "En cola", "En mantenimiento"];
    const serviciosEnMantenimiento = await Servicio.find({ "usuario.idusuario": idusuarioF, estado: { $in: estado } });
    if (serviciosEnMantenimiento.length > 0) {
      res.json(serviciosEnMantenimiento);
    } else {
      res.status(404).send("No se encontraron servicios en mantenimiento");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Asignar servicio especifico//SERVICIOS




// Cargar SERVICIOS de un TECNICO// -----FUNCIONAL**
router.get("/serviciosTecnico/:idusuario", async (req, res) => {
  try {
    const idusuarioF = parseInt(req.params.idusuario);
    const estado = "En mantenimiento";
    const serviciosTecAsignados = await Servicio.find({ "tecnico.idusuario": idusuarioF, estado: { $in: estado } });
    if (serviciosTecAsignados.length > 0) {
      res.json(serviciosTecAsignados);
    } else {
      res.status(404).send("No se encontraron servicios para el tecnico en mantenimiento");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar SERVICIOS FINALIZADOS de un TECNICO//SERVICIOS
router.get("/serviciosTecnicoFin/:idusuario", async (req, res) => {
  try {
    const idusuarioF = parseInt(req.params.idusuario);
    const estado = ["Listo para entregar", "Entregado"];
    const serviciosTecFinalizados = await Servicio.find({ "tecnico.idusuario": idusuarioF, estado: { $in: estado } });
    if (serviciosTecFinalizados.length > 0) {
      res.json(serviciosTecFinalizados);
    } else {
      res.status(404).send("No se encontraron servicios finalizados para el tecnico");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// Cargar SERVICIOS ENTREGADOS de un USUARIO (READ) *FUNCIONAL**
router.get("/serviciosEntregadosUsuario/:idusuario", async (req, res) => {
  try {
    const idusuarioF = parseInt(req.params.idusuario);
    const estado = "Entregado";
    const serviciosEntregados = await Servicio.find({ "usuario.idusuario": idusuarioF, estado: { $in: estado } });
    if (serviciosEntregados.length > 0) {
      res.json(serviciosEntregados);
    } else {
      res.status(404).send("No se encontraron servicios entregados");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



//EDITAR SERVICIO especififco (UPDATE) *FUNCIONAL*
router.post("/EditService", async (req, res) => {
  try {
    const {
      marca,
      tipodispositivo,
      estado,
      numeroserie,
      comentariossalida,
      ram,
      tipodisco,
      modelo,
    } = req.body;
    const idservicio = parseInt(req.body.idservicio);
    const servicio = await Servicio.findOneAndUpdate(
      { idservicio },
      {
        marca,
        tipodispositivo,
        estado,
        numeroserie,
        comentariossalida,
        ram,
        tipodisco,
        modelo,
      },
      { new: true }
    );

    if (servicio) {
      res.json(servicio);
    } else {
      res.status(404).send("Servicio no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// CREAR un SERVICIO *FUNCIONAL*
router.post("/crearServicio", async (req, res) => {
  try {
    const {
      usuario,
      comentariosentrada,
      marca,
      tipodispositivo,
      numeroserie,
      modelo,
    } = req.body;

    const lastService = await Servicio.findOne().sort("-idservicio");
    const newId = lastService ? lastService.idservicio + 1 : 1;
    const fechaEntrada = new Date();

    const newService = new Servicio({
      idservicio: newId,
      comentariosentrada,
      marca,
      tipodispositivo,
      modelo,
      numeroserie,
      estado: true,
      comentariossalida: "",
      ram: "",
      tipodisco: "",
      estado: "En cola",
      fechaasignacionM: null,
      fechafinalizacionM: null,
      fechaentrada: fechaEntrada,
      fechasalida: null,
      usuario: {
        usuario: usuario.usuario,
        password: usuario.password,
        idrol: usuario.idrol,
        idusuario: usuario.idusuario,
        nombre: usuario.nombre,
        estado: usuario.estado,
        correo: usuario.correo,
      },
      tecnico: {
        usuario: null,
        password: null,
        idrol: null,
        idusuario: null,
        nombre: null,
        estado: null,
        correo: null,
      },
    });

    await newService.save();

    res.json("Se ha insertado correctamente el servicio");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
