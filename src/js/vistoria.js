//Dados Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGgk0mDtYN4V7lsGqni3buCJ2cN03jccU",
  authDomain: "vistoria-18512.firebaseapp.com",
  projectId: "vistoria-18512",
  storageBucket: "vistoria-18512.firebasestorage.app",
  messagingSenderId: "686144622304",
  appId: "1:686144622304:web:cfa35ba985568d44d10a85",
  measurementId: "G-M5DYEBN29V"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ----------- ENVIO PARA IMGBB -----------
async function enviarParaImgBB(base64, nomeFoto) {
  const apiKey = "5c298eb2a1382aeb9277e4da5696b77d";

  const base64Limpo = base64.split(",")[1];

  const formData = new FormData();
  formData.append("image", base64Limpo);
  formData.append("name", nomeFoto);

  const resposta = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });

  const dados = await resposta.json();
  return dados;
}

// ---------- LISTAS DE FOTOS ----------
const fotosCarro = [
  { nome: "Frente", ref: "../images/imgvistoria/carros/frente.jpeg" },
  { nome: "Frente Lado 1", ref: "../images/imgvistoria/carros/frentelado1.jpeg" },
  { nome: "Farol Dianteiro 1", ref: "../images/imgvistoria/carros/faroldianteiro1.jpeg" },
  { nome: "Pneu Dianteiro 1", ref: "../images/imgvistoria/carros/pneudianteiro1.jpeg" },
  { nome: "Espelho Dianteiro 1", ref: "../images/imgvistoria/carros/espelho1.jpeg" },
  { nome: "Frente Lado 2", ref: "../images/imgvistoria/carros/frentelado2.jpeg" },
  { nome: "Farol Dianteiro 2", ref: "../images/imgvistoria/carros/faroldianteiro2.jpeg" },
  { nome: "Pneu Dianteiro 2", ref: "../images/imgvistoria/carros/pneudianteiro2.jpeg" },
  { nome: "Espelho Dianteiro 2", ref: "../images/imgvistoria/carros/espelho2.jpeg" },
  { nome: "Traseira", ref: "../images/imgvistoria/carros/traseira.jpeg" },
  { nome: "Traseira lado 1", ref: "../images/imgvistoria/carros/traseiralado1.jpeg" },
  { nome: "Farol Traseiro 1", ref: "../images/imgvistoria/carros/faroltraseira1.jpeg" },
  { nome: "Pneu Traseiro 1", ref: "../images/imgvistoria/carros/pneutraseiro1.jpeg" },
  { nome: "Traseira lado 2", ref: "../images/imgvistoria/carros/traseiralado2.jpeg" },
  { nome: "Farol Traseiro 2", ref: "../images/imgvistoria/carros/faroltraseira2.jpeg" },
  { nome: "Pneu Traseiro 2", ref: "../images/imgvistoria/carros/pneutraseiro2.jpeg" },
  { nome: "Porta Aberta", ref: "../images/imgvistoria/carros/portaaberta.jpeg" },
  { nome: "Kilometragem com chave virada", ref: "../images/imgvistoria/carros/kilometragem.jpeg" },
  { nome: "Parabrisa", ref: "../images/imgvistoria/carros/parabrisa.jpeg" },
  { nome: "Motor", ref: "../images/imgvistoria/carros/Motor.jpeg" },
  { nome: "Chassi", ref: "../images/imgvistoria/carros/chassi.jpeg" },
];

const fotosMoto = [
  { nome: "Frente", ref:"img/moto/frente.JPEG" },
  { nome: "Frente Lado 1", ref: "../images/imgvistoria/moto/frentelado1.JPEG" },
  { nome: "Frente lado 2", ref: "../images/imgvistoria/moto/frentelado2.JPEG" },
  { nome: "Pneu Da frente", ref: "../images/imgvistoria/moto/pneufrente.JPEG" },
  { nome: "Kilometragem", ref: "../images/imgvistoria/moto/kilometragem.JPEG"},
  { nome: "Traseira", ref: "../images/imgvistoria/moto/traseira.JPEG" },
  { nome: "Traseira Lado 1", ref: "../images/imgvistoria/moto/traseiralado1.JPEG" },
  { nome: "Traseira Lado 2", ref: "../images/imgvistoria/moto/traseiralado2.JPEG" },
  { nome: "Pneu Traseiro", ref: "../images/imgvistoria/moto/pneutraseiro.JPEG" },
  { nome: "Placa", ref: "../images/imgvistoria/moto/placa.JPEG" },
  { nome: "Chassi", ref: "../images/imgvistoria/moto/chassi.JPEG" }
];

const MENSAGEM_WHATS = encodeURIComponent(
  "Olá, acabei de realizar uma vistoria! Confira as fotos no link abaixo:\nhttps://appvistoriaweb.netlify.app/fotossite"
);

// ---------- VARIÁVEIS ----------
let fotosLista = [];
let fotosLinks = [];
let indiceFoto = 0;

// ---------- ELEMENTOS ----------
const modalOverlay = document.getElementById("modal-overlay");
const modais = {
  instrucoes: document.getElementById("instruction"),
  veiculo: document.getElementById("modal-veiculo"),
  modo: document.getElementById("modal-modo-fotos"),
  especifica: document.getElementById("modal-fotos-especificas"),
  foto: document.getElementById("modal-foto"),
  resultado: document.getElementById("modal-resultado")
};

const btnFazerVistoria = document.getElementById("btn-fazer-vistoria");
const veiculoBtns = modais.veiculo.querySelectorAll("button");
const btnTodas = document.getElementById("btn-todas");
const btnEspecifica = document.getElementById("btn-especifica");
const listaFotosEspecificas = document.getElementById("lista-fotos-especificas");

const tituloFoto = document.getElementById("titulo-foto");
const referenciaImg = document.getElementById("referencia-img");
const irCameraBtn = document.getElementById("ir-camera");

const cameraContainer = document.getElementById("camera-container");
const video = document.getElementById("video");
const tirarFotoBtn = document.getElementById("tirar-foto");

const fotoTiradaImg = document.getElementById("foto-tirada");
const refazerBtn = document.getElementById("refazer");
const proximaBtn = document.getElementById("proxima");
const fotoReferenciaResultado = document.getElementById("foto-referencia");
const btnIniciarEspecifica = document.getElementById("btn-iniciar-especifica");

const modalLoading = document.getElementById("modal-loading");

// ---------- FUNÇÕES AUXILIARES ----------
function mostrarModal(modal) {
  Object.values(modais).forEach(m => m.classList.remove("active"));
  modal.classList.add("active");
  modalOverlay.style.display = "flex";
}

async function startCamera() {
  try {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

function mostrarFotoAtual() {
  const fotoAtual = fotosLista[indiceFoto];
  tituloFoto.textContent = fotoAtual.nome;
  referenciaImg.src = fotoAtual.ref || "placeholder.png";
  mostrarModal(modais.foto);
}

// ----------- ENVIO FINAL -----------
async function enviarTodasFotos() {
  let urls = [];

  for (let i = 0; i < fotosLinks.length; i++) {
    const base64 = fotosLinks[i];
    const nomeOriginal = fotosLista[i].nome;

    const nomeFormatado = nomeOriginal
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/[^\w_]/g, "");

    const resultado = await enviarParaImgBB(base64, nomeFormatado);

    if (resultado.success) {
      urls.push({
        nome: nomeOriginal,
        nomeArquivo: nomeFormatado,
        url: resultado.data.url
      });
    } else {
      urls.push({
        nome: nomeOriginal,
        url: "ERRO"
      });
    }
  }

  console.log("Resultado Final:", urls);
  return urls;
}

function mostrarLoading() {
  modalOverlay.style.display = "flex";
  modalLoading.style.display = "flex";

  (async () => {
    const resultadoFinal = await enviarTodasFotos(); 
    console.log("Resultado final:", resultadoFinal);

    alert("Vistoria enviada com sucesso!");

    modalLoading.style.display = "none";
  })();
}

// ---------- EVENTOS ----------
btnFazerVistoria.addEventListener("click", () => {
  mostrarModal(modais.veiculo);
  startCamera();
  localStorage.setItem("vistoriaAcessada", "true");
});

veiculoBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.getAttribute("data-veiculo");
    fotosLista =
      tipo === "carro" ? fotosCarro :
      tipo === "moto" ? fotosMoto : fotosCaminhao;
    mostrarModal(modais.modo);
  });
});

btnIniciarEspecifica.addEventListener("click", () => {
  const checkboxes = listaFotosEspecificas.querySelectorAll("input[type=checkbox]:checked");
  if (checkboxes.length === 0) {
    alert("Selecione pelo menos uma foto!");
    return;
  }

  fotosLista = Array.from(checkboxes).map(cb => fotosLista[parseInt(cb.value)]);
  fotosLinks = [];
  indiceFoto = 0;

  mostrarFotoAtual();
});

btnTodas.addEventListener("click", () => {
  indiceFoto = 0;
  fotosLinks = [];
  mostrarFotoAtual();
});

btnEspecifica.addEventListener("click", () => {
  listaFotosEspecificas.innerHTML = "";
  fotosLista.forEach((f, i) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${i}"> ${f.nome}`;
    listaFotosEspecificas.appendChild(label);
    listaFotosEspecificas.appendChild(document.createElement("br"));
  });
  mostrarModal(modais.especifica);
});

irCameraBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

tirarFotoBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  if (videoHeight > videoWidth) {
    canvas.width = videoHeight;
    canvas.height = videoWidth;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(video, -videoWidth / 2, -videoHeight / 2, videoWidth, videoHeight);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  } else {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  const now = new Date();
  const dataHora = now.toLocaleString("pt-BR", { hour12: false });
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeText(dataHora, 20, canvas.height - 30);
  ctx.fillText(dataHora, 20, canvas.height - 30);

  const dataUrl = canvas.toDataURL("image/jpeg");
  fotoTiradaImg.src = dataUrl;
  fotosLinks[indiceFoto] = dataUrl;

  const fotoAtual = fotosLista[indiceFoto];
  fotoReferenciaResultado.src = fotoAtual.ref || "placeholder.png";

  proximaBtn.textContent = indiceFoto === fotosLista.length - 1 ? "Finalizar Vistoria" : "Próxima Foto";

  modalOverlay.style.display = "flex";
  mostrarModal(modais.resultado);
});

refazerBtn.addEventListener("click", () => {
  fotosLinks[indiceFoto] = null;
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

proximaBtn.addEventListener("click", () => {
  if (indiceFoto === fotosLista.length - 1) {
    mostrarLoading();
  } else {
    indiceFoto++;
    mostrarFotoAtual();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("vistoriaAcessada")) {
    startCamera();
    mostrarModal(modais.instrucoes);
  } else {
    modalOverlay.style.display = "flex";
    mostrarModal(modais.instrucoes);
  }
});
