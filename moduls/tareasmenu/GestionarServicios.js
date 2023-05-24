var idrol = null;
var idUsuario = null;
var comentariosVigentes = "";

$(document).ready(function () {
  verificarSesion();
  LimpiarFormulario();

  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  cargarInfoServicio(idParam);

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#btnGestionar").on("click", function () {
    ValidarFormulario();
  });

  $("#numeroServicio").on("change", function () {
    let idservicio = $("#numeroServicio").val();
    cargarInfoServicio(idservicio);
  });

  $("#volverAsignados").on("click", function () {
    window.location.href = "../tareasmenu/ServiciosAsignados.html";
  });

  setTimeout(validarUsuario, 400);
});

function validarUsuario() {
  if (idrol === 3) {
    $("#volverAsignados").removeClass("hidden");
  }
}

function cargarInfoServicio(idservicio) {
  if (idservicio === null) {
    return;
  }
  idservicio = parseInt(idservicio);
  $("#numeroServicio").val(idservicio);

  spinner("Cargando datos del servicio, por favor espere");
  const url = "/api/servicioEspecifico";
  const data = {
    idservicio: idservicio,
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
      cargarDatos(result);
      $("#spinner").hide();
    })
    .catch((error) => {
      console.log(error);
      AlertIncorrecta("No se pudo cargar el servicio");
      LimpiarFormulario();
      $("#spinner").hide();
    });
}

function cargarDatos(data) {
  if (data.estado === "Entregado") {
    AlertIncorrecta(
      "El servicio ya fue <b>Entregado</b> y no puedes realizar modificaciones!"
    );
    LimpiarFormulario();
    return;
  }
  $("#comentariosEntrada").val(data.comentariosentrada);
  $("#marca").val(data.marca);
  $("#modelo").val(data.modelo);
  $("#tipoDispositivo").val(data.tipodispositivo);
  $("#estado").val(data.estado);
  $("#numeroSerie").val(data.numeroserie);
  $("#comentariosSalida").val("");
  $("#ram").val(data.ram);
  $("#tipoDisco").val(data.tipodisco);
  comentariosVigentes = data.comentariossalida;
}

function ValidarFormulario() {
  let ComentariosSalida = $("#comentariosSalida").val();
  let Marca = $("#marca").val();
  let Estado = $("#estado").val();
  let TipoDispositivo = $("#tipoDispositivo").val();
  let idservicio = $("#numeroServicio").val();
  let ram = $("#ram").val();
  let tipodisco = $("#tipoDisco").val();
  let modelo = $("#modelo").val();

  if (idservicio === "") {
    AlertIncorrecta("Debes indicar un número de servicio");
    return;
  }

  if (modelo === "") {
    AlertIncorrecta("Debes indicar el modelo del dispositivo");
    return;
  }
  if (Marca === "") {
    AlertIncorrecta("Debes indicar la marca del dispositivo");
    return;
  }
  if (TipoDispositivo === "") {
    AlertIncorrecta("Debes seleccionar un tipo de dispositivo");
    return;
  }
  if (ram === "") {
    AlertIncorrecta("Debes indicar la cantidad de memoria ram del dispositivo");
    return;
  }
  if (tipodisco === "") {
    AlertIncorrecta("Debes indicar el tipo de almacenamiento del dispositivo");
    return;
  }
  if (Estado === "") {
    AlertIncorrecta("Debes indicar el estado del servicio");
    return;
  }
  if (Estado === "En cola") {
    AlertIncorrecta("No puedes dejar en cola el servicio a gestionar");
    return;
  }
  if (ComentariosSalida === "") {
    AlertIncorrecta(
      "Debes indicar alguna información sobre la actualizacion del servicio"
    );
    return;
  }
  if (Estado === "Entregado") {
    ConfirmacioFinalizar();
    return;
  }
  if (Estado === "Listo para entregar") {
    ConfirmacionEntregable();
    return;
  }
  ActualizarServicio();
}

function ConfirmacionEntregable() {
  Swal.fire({
    title: "",
    html: "Estas seguro de dar por <b>finalizado el mantenimiento</b> del servicio?",
    imageUrl: "../../Multimedia/icoAlertWarning.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Aceptar",
    denyButtonText: "Volver",
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
      denyButton: "buttonBtn btnPrimary ",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      ActualizarAsignacion();
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function ActualizarAsignacion() {
  let idservicio = parseInt($("#numeroServicio").val());

  const url = "/api/finalizarAsignacion";
  const data = {
    idservicio: idservicio,
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
      ActualizarServicio();
    })
    .catch((error) => {
      console.error("Error al modificar:", error);
    });
}

function RegistrarAuditoria(idservicio) {
  spinner("Registrando Auditoria");
  let descripcionAuditoria =
    "Actualización la información y/o estado del mantenimento con id:" +
    idservicio;
  const url = "/api/NewAudtoria";
  const data = {
    idusuario: idUsuario,
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
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });
}

function RegistrarAuditoriaFinalizado(idservicio) {
  spinner("Registrando Auditoria");
  let descripcionAuditoria =
    "Entregado el dispositivo y finalizado el servicio con id:" + idservicio;
  const url = "/api/NewAudtoria";
  const data = {
    idusuario: idUsuario,
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
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });
}

function ConfirmacioFinalizar() {
  Swal.fire({
    title: "",
    html: "Estas seguro de dar por <b>finalizado</b> el servicio?",
    imageUrl: "../../Multimedia/icoAlertWarning.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Aceptar",
    denyButtonText: "Volver",
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
      denyButton: "buttonBtn btnPrimary ",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      ActualizarServicio();
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function ActualizarServicio() {
  spinner("Actualizando el  servicio, por favor espere");
  let idservicio = parseInt($("#numeroServicio").val());
  let ComentariosSalida =
    comentariosVigentes + " -> " + $("#comentariosSalida").val();
  let Marca = $("#marca").val();
  let Estado = $("#estado").val();
  let TipoDispositivo = $("#tipoDispositivo").val();
  let numeroserie = $("#numeroSerie").val();
  let ram = $("#ram").val();
  let tipodisco = $("#tipoDisco").val();
  let modelo = $("#modelo").val();

  const url = "/api/EditService";
  const dataM = {
    idservicio: idservicio,
    marca: Marca,
    tipodispositivo: TipoDispositivo,
    estado: Estado,
    numeroserie,
    comentariossalida: ComentariosSalida,
    ram: ram,
    tipodisco: tipodisco,
    modelo: modelo,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(dataM),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if ($("#estado").val() === "Entregado") {
        RegistrarAuditoriaFinalizado(idservicio);
        AlertCorrectX("Gracias por entregar el servicio!!");
        setTimeout(function () {
          window.location.href = "../tareasmenu/menu.html";
        }, 800);
      } else {
        RegistrarAuditoria(idservicio);
        AlertCorrectX("Servicio modificado exitosamente!");
        sleep(500);
        setTimeout(function () {
          ValidarSalida();
        }, 1200);
      }
    })
    .catch((error) => {
      console.error("Error al modificar:", error);
    });
  $("#spinner").hide();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ValidarSalida() {
  Swal.fire({
    title: "",
    html: "Deseas seguir gestionando el servicio?",
    imageUrl: "../../Multimedia/icoAlertWarning.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: "No",
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
      denyButton: "buttonBtn btnPrimary ",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      cargarInfoServicio($("#numeroServicio").val());
    } else if (result.isDenied) {
      AlertCorrectX("Gracias!!");
      setTimeout(function () {
        window.location.href = "../tareasmenu/menu.html";
      }, 800);
    }
  });
}

function LimpiarFormulario() {
  $("#comentariosEntrada").val("");
  $("#marca").val("");
  $("#tipoDispositivo").val("");
  $("#numeroSerie").val("");
  $("#numeroServicio").val("");
  $("#comentariosSalida").val("");
  $("#ram").val("");
  $("#estado").val("");
  $("#tipoDisco").val("");
  $("#modelo").val("");
}
