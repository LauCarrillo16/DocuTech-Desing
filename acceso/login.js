/* global utilidadesjQuery */

$(document).ready(function () {
  limpiarNewUser();
  limpiarCampos();
  $("#password").on("keydown", function (event) {
    var tecla = event.keyCode
      ? event.keyCode
      : event.which
        ? event.which
        : event.charCode;
    if (tecla === 13) {
      setTimeout(function () {
        verificarLogin();
      }, 500);
    }
  });

  $("#usuario").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#password").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newPassword").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newPassword2").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newCorreo").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newUser").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#usuario").on("keydown", function (event) {
    var tecla = event.keyCode
      ? event.keyCode
      : event.which
        ? event.which
        : event.charCode;
    if (tecla === 13) {
      setTimeout(function () {
        verificarLogin();
      }, 500);
    }
  });

  $("#usuario, #password").focus(function () {
    $("p.pTxtMsg").addClass("hidden");
  });

  $("div#divGlobal").removeClass("hidden");

  $("button#btnIniciarSesion").on("click", function () {
    verificarLogin();
  });

  $("div#divGlobal").overlayScrollbars({
    overflowBehavior: {
      x: "hidden",
    },
    scrollbars: {
      // autoHide: "leave", //"never", "scroll", "leave", "move"
    },
  });

  $("#newCliente").on("click", function () {
    $("#modalNewUser").modal("show");
  });

  $("#btnRegistrar").on("click", function () {
    ValidarNuevoUsuario();
  });

  configuracionInput();

  $(".input-key").keyup(function () {
    if ($(this).val().length == $(this).attr("maxlength")) {
      $(this).next(".input-key").focus();
    }
  });
});

function ValidarNuevoUsuario() {
  let nuevoUsuario = $("#newUser").val().trim();
  let UserUPP = nuevoUsuario.toUpperCase();
  let nuevoPass = $("#newPassword").val();
  let nuevoPass2 = $("#newPassword2").val();
  let correo = $("#newCorreo").val();
  let nombreCompleto = $("#newName").val();

  if (nuevoUsuario === "") {
    AlertIncorrecta("Debes seleccionar un nombre de usuario");
    return;
  }
  if (nuevoPass === "") {
    AlertIncorrecta("La contraseña no puede estar vacia");
    return;
  }
  if (nuevoPass2 === "") {
    AlertIncorrecta("La confirmación de la contraseña no puede estar vacia");
    return;
  }
  if (correo === "") {
    AlertIncorrecta("El correo no puede estar vacio");
    return;
  } else {
    var patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!patron.test(correo)) {
      AlertIncorrecta("El correo electrónico ingresado no es válido.");
      return;
    }
  }
  if (nombreCompleto === "") {
    AlertIncorrecta("Debes proporcionarnos tu nombre completo");
    return;
  }

  if (nuevoPass !== nuevoPass2) {
    AlertIncorrecta("Las contraseñas no son iguales");
    return;
  }
  $("#modalNewUser").modal("hide");
  spinner("Validando el usuario, por favor espere");
  const url1 = "/usuarios/EspecificLogin/" + UserUPP;
  fetch(url1, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result === "Login no encontrado") {
        RegistrarNewUser();
      } else {
        $("#spinner").hide();
        AlertIncorrecta("No puedes registrarte con este nombre de usuario.");
        $("#modalNewUser").modal("show");
      }
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo registrar");
      $("#spinner").hide();
    });
}
function RegistrarNewUser() {
  spinner("Registrando un nuevo usuario, por favor espere");
  let nuevoUsuario = $("#newUser").val().toUpperCase();
  let nuevoPass = $("#newPassword").val();
  let correo = $("#newCorreo").val();
  let nombreCompleto = $("#newName").val();

  const url = "/usuarios/crearUsuario";
  const data = {
    usuario: nuevoUsuario,
    password: (nuevoPass),
    idrol: 2,
    nombre: nombreCompleto,
    correo: correo,
  };

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      AlertCorrectX("Usuario registrado en el sistema!! ");
      $("#usuario").val(nuevoUsuario);
      $("#password").val(nuevoPass);
      limpiarNewUser();
      $("#spinner").hide();
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
      $("#spinner").hide();
    });
}


function verificarLogin() {
  var usuario = $("#usuario").val().trim();
  var password = $("#password").val();
  if (usuario === "") {
    AlertIncorrecta(
      "Debe proporcionar un nombre de usuario para acceder al sistema"
    );
    return;
  }
  if (password === "") {
    AlertIncorrecta("Debe proporcionar contraseña para acceder al sistema");
    return;
  }
  var fecha = new Date();

  ValidarUsuario();
  spinner("Validando Usuario, por favor espere...");
}

function AlertIncorrecta(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
    imageUrl: "../Multimedia/icoAlertWarning.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Aceptar",
    denyButtonText: "",
    customClass: {
      container: "",
      popup: "",
      header: "",
      title: "",
      closeButton: "",
      icon: "",
      image: "",
      content: "",
      htmlContainer: "",
      input: "",
      inputLabel: "",
      validationMessage: "",
      actions: "",
      confirmButton: "buttonBtn btnPrimary",
      denyButton: "buttonBtn btnPrimary btnHidden",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // CONFIRMED CODE
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function AlertCorrecta(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
    imageUrl: "../Multimedia/icoAlertSuccess.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Aceptar",
    denyButtonText: "",
    customClass: {
      container: "",
      popup: "",
      header: "",
      title: "",
      closeButton: "",
      icon: "",
      image: "",
      content: "",
      htmlContainer: "",
      input: "",
      inputLabel: "",
      validationMessage: "",
      actions: "",
      confirmButton: "buttonBtn btnPrimary",
      denyButton: "buttonBtn btnPrimary btnHidden",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // CONFIRMED CODE
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function ValidarUsuario() {
  const usuario = $("#usuario").val().toUpperCase();
  const password = document.getElementById("password").value;
  const url = "/usuarios/validarLogin";
  const data = {
    usuario: usuario,
    password: (password),
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      IniciarSession(result.idusuario, result.idrol, result.nombre);
      $("#spinner").hide();
    })
    .catch((error) => {
      console.error("Error al validar el usuario:", error);
      // Lógica para manejar el error...
      AlertIncorrecta("Usuario y/o contraseña incorrecta");
      $("#spinner").hide();
    });
}

function RegistrarAuditoria(idusuario) {
  spinner("Registrando Auditoria");

  let usuario ={};
  const url1 = "/usuarios/EspecificUser/" + idusuario;
  fetch(url1, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
    usuario = result;
    let descripcionAuditoria = "Ingreso exitoso al sistema";
    const url = "/auditorias/newAuditoria";
    const data = {
      usuario: usuario,
      descripcion: descripcionAuditoria,
    };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        $("#spinner").hide();
        AlertCorrecta("Bienvenido al sistema!");
        setTimeout(function () {
          window.location.href = "/moduls/tareasmenu/menu.html";
        }, 1500);
      })
      .catch((error) => {
        console.error("Error al ingresar:", error);
      });
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo registrar");
      $("#spinner").hide();
    });





}

function limpiarNewUser() {
  $("#newUser").val("");
  $("#newPassword").val("");
  $("#newPassword2").val("");
  $("#newCorreo").val("");
  $("#newName").val("");
}

function limpiarCampos() {
  $("#usuario").val("");
  $("#password").val("");
}

function CerrarAlerta() {
  $.alerts._hide();
  callback(true);
}

function IniciarSession(idusuario, idrol, nombre) {
  fetch("/api/sesion", {
    method: "POST",
    body: JSON.stringify({ idusuario: idusuario, idrol: idrol, nombre: nombre }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  RegistrarAuditoria(idusuario);
  
}

function spinner(texto) {
  if (texto === "") {
    texto = "Cargando...";
  }
  if (texto === false) {
    $("#spinner").hide();
    return;
  }
  $("#textLoad").html(texto);
  $("#spinner").show();
}
