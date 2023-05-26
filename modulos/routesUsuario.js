const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Usuario = require("../modelos/usuarios");

router.use(bodyParser.json());

// Insertar un nuevo USUARIO (CREATE) *FUNCIONAL*
router.post("/crearUsuario", async (req, res) => {
  try {
    const { usuario, password, idrol, nombre, correo } = req.body;
    const lastUser = await Usuario.collection.findOne(
      {},
      { sort: { idusuario: -1 } }
    );
    const newId = lastUser ? lastUser.idusuario + 1 : 1;

    const newUser = new Usuario({
      idusuario: newId,
      usuario,
      password,
      idrol,
      nombre,
      estado: true,
      correo,
    });

    const result = await newUser.save();
    res.json("Se ha insertado correctamente el usuario para: " + nombre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Cargar todos los usuarios (READ)
router.get("/totalUsuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    if (usuarios.length > 0) {
      res.json(usuarios);
    } else {
      res.status(404).send("No se encontraron usuarios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Actualizar USUARIO especififco (UPDATE)

router.post("/editarUsuario", async (req, res) => {
  try {
    const { usuario, password, idrol, nombre, estado, correo } = req.body;
    const idusuario = parseInt(req.body.idusuario);
    const idrolInt = parseInt(idrol);
    const estadoBool = estado;

    const user = await Usuario.findOneAndUpdate(
      { idusuario },
      {
        usuario,
        password,
        idrol: idrolInt,
        nombre,
        estado: estadoBool,
        correo,
      },
      { new: true }
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar USUARIO especifico (DELETE) *MODIFICAR*
router.get("/eliminarUsuario/:idusuario", async (req, res) => {
  try {
    const idusuario = parseInt(req.params.idusuario);
    const result = await Usuario.deleteOne({ idusuario: idusuario });
    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Validar USUARIO para iniciar Sesion (READ AND VALIDATION) *FUNCIONAL*
router.post("/validarLogin", async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const user = await Usuario.findOne({ usuario: usuario });
    if (user) {
      if (user.password === password) {
        res.json("Acceso validado!");
      } else {
        res.status(401).send("Contraseña incorrecta");
      }
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Cargar USUARIO Especifico (READ) *FUNCIONAL*
router.get("/EspecificUser/:idusuario", async (req, res) => {
  const idusuarioF = parseInt(req.params.idusuario);
  try {
    const usuario = await Usuario.findOne({ idusuario: 1 });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Validar USUARIO(LOGIN) existente para validación de nuevo usuario *FUNCIONAL*
router.get("/EspecificLogin/:usuario", async (req, res) => {
  const usuarioF = req.params.usuario;
  console.log("Esta llegando ");
  try {
    const usuario = await Usuario.findOne({ usuario: usuarioF });
    if (usuario) {
      res.json("Login existente");
    } else {
      res.json("Login no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar Usuarios de Tipo Tecnico
router.get("/cargarTecnicos", async (req, res) => {
  try {
    const query = {
      idrol: 3, // Cambiar según el id del rol de técnico
      estado: true,
    };
    const projection = {
      correo: 1,
      idusuario: 1,
      nombre: 1,
      _id: 0,
    };
    const result = await Usuario.find(query, projection);
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("Técnicos no encontrados");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Consultar por FILTROS
router.post("/FiltrarUsuarios", async (req, res) => {
  try {
    const query = {};
    if (req.body.nombre) {
      query.nombre = { $regex: req.body.nombre, $options: "i" };
    }
    if (req.body.idrol) {
      query.idrol = req.body.idrol;
    }
    if (req.body.usuario) {
      query.usuario = req.body.usuario;
    }
    if (typeof req.body.estado === "boolean") {
      query.estado = req.body.estado;
    }
    const result = await Usuario.find(query);
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("No se encontraron usuarios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
