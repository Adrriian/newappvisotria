// vistoria.js - Vistoria com rotação e data/hora

// ----------------- CONFIG FIREBASE -----------------
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

// ----------------- IMGBB -----------------
async function enviarParaImgBB(base64, nomeFoto) {
  const apiKey = "0622c9e1bc2eaa66e70fb3c76a6c2a11";
  const base64Limpo = base64.split(",")[1];

  const formData = new FormData();
  formData.append("image", base64Limpo);
  formData.append("name", nomeFoto);

  try {
    const resposta = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData
    });

    const dados = await resposta.json();
    return dados;
  } catch (err) {
    console.error("Erro upload ImgBB:", err);
    return { success: false, error: err };
  }
}

// ----------------- PEGAR ID DA VISTORIA -----------------
const urlParams = new URLSearchParams(window.location.search);
const vistoriaID = urlParams.get('vistoria');
if (!vistoriaID) {
  alert("Erro: Nenhuma vistoria encontrada na URL.");
  throw new Error("Nenhuma vistoria encontrada");
}

// ----------------- LISTAS DE REFERÊNCIA -----------------
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
  { nome: "Farol Traseiro 1", ref: "../images/imgvistoria/carros/faroltraseiro1.jpeg" },
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
  { nome: "Frente", ref:"../images/imgvistoria/moto/frente.JPEG" },
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

// ----------------- VARIÁVEIS DE EXECUÇÃO -----------------
let fotosLista = [];
let fotosLinks = [];
let indiceFoto = 0;

// ----------------- ELEMENTOS -----------------
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
const veiculoBtns = modais.veiculo ? modais.veiculo.querySelectorAll("button") : [];
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

// ----------------- FUNÇÕES -----------------
function mostrarModal(modal) {
  Object.values(modais).forEach(m => m && m.classList.remove("active"));
  if (modal) modal.classList.add("active");
  modalOverlay.style.display = "flex";
}

async function startCamera() {
  try {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    await new Promise(resolve => {
      if (video.videoWidth > 0) return resolve();
      video.onloadedmetadata = resolve;
    });

    // AVISO: checar rotação do celular
    if (!screen.orientation || screen.orientation.type.includes("portrait-primary") === false) {
      alert("⚠️ Ative a rotação automática do celular para fotos na orientação correta.");
    }

  } catch (err) {
    alert("Erro ao acessar a câmera");
    console.error(err);
  }
}

// ----------------- TIRA FOTO COM DATA/HORA E ORIENTAÇÃO -----------------
function tirarFoto() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  // Detecta orientação do celular pelo window
  const angle = screen.orientation ? screen.orientation.angle : 0;
  const vertical = angle === 0 || angle === 180;
  const horizontal = angle === 90 || angle === -90;

  if (vertical) {
    canvas.width = vw;
    canvas.height = vh;
    ctx.drawImage(video, 0, 0, vw, vh);
  } else if (horizontal) {
    canvas.width = vh;
    canvas.height = vw;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(video, -vw / 2, -vh / 2, vw, vh);
    ctx.restore();
  }

  // DATA E HORA
  const agora = new Date();
  const dataHora = agora.toLocaleString("pt-BR", { hour12: false });
  ctx.font = "22px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  const padding = 10;
  const textWidth = ctx.measureText(dataHora).width;
  const x = canvas.width - textWidth - padding;
  const y = canvas.height - padding;
  ctx.strokeText(dataHora, x, y);
  ctx.fillText(dataHora, x, y);

  return canvas.toDataURL("image/jpeg", 0.9);
}

// ----------------- MOSTRAR FOTO ATUAL -----------------
function mostrarFotoAtual() {
  const fotoAtual = fotosLista[indiceFoto];
  tituloFoto.textContent = fotoAtual.nome;
  referenciaImg.src = fotoAtual.ref || "placeholder.png";
  mostrarModal(modais.foto);
}

// ----------------- UPLOAD -----------------
async function enviarTodasFotosParaImgBBSalvarFirestore() {
  const pares = fotosLinks
    .map((base64, i) => ({ base64, meta: fotosLista[i] }))
    .filter(p => p.base64);

  if (pares.length === 0) throw new Error("Nenhuma foto para enviar.");

  const resultados = [];

  for (let i = 0; i < pares.length; i++) {
    const { base64, meta } = pares[i];
    const nomeOriginal = meta.nome;
    const nomeFormatado = nomeOriginal.toLowerCase().replace(/ /g, "_").replace(/[^\w_]/g, "");
    const resp = await enviarParaImgBB(base64, nomeFormatado);

    if (resp && resp.success) {
      resultados.push({ nome: nomeOriginal, nomeArquivo: nomeFormatado, url: resp.data.url });
    } else {
      resultados.push({ nome: nomeOriginal, nomeArquivo: nomeFormatado, url: null, error: resp && resp.error });
    }
  }

  try {
    await db.collection("vistoria").doc(vistoriaID).update({
      fotos: firebase.firestore.FieldValue.arrayUnion(...resultados),
      status: "finalizada",
      finalizadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch {
    await db.collection("vistoria").doc(vistoriaID).set({
      fotos: resultados,
      status: "finalizada",
      finalizadoEm: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  return resultados;
}

// ----------------- LOADING E REDIRECIONAMENTO -----------------
function mostrarLoading() {
  modalOverlay.style.display = "flex";
  modalLoading.style.display = "flex";

  (async () => {
    try {
      const resultadoFinal = await enviarTodasFotosParaImgBBSalvarFirestore();

      modalLoading.style.display = "none";
      alert("Vistoria enviada com sucesso!");

      const doc = await db.collection('vistoria').doc(vistoriaID).get();
      const dados = doc.exists ? doc.data() : null;
      const whatsRaw = dados && (dados.whats_consultor || dados.telefoneConsultor || dados.telefone || dados.whatsapp);
      if (whatsRaw) {
        const whatsClean = String(whatsRaw).replace(/\D/g, "");
        const msg = encodeURIComponent("Vistoria concluída! Já enviei as fotos no sistema.");
        const withCountry = whatsClean.startsWith("55") ? whatsClean : `55${whatsClean}`;
        window.location.href = `https://wa.me/${withCountry}?text=${msg}`;
      }
    } catch (err) {
      console.error(err);
      modalLoading.style.display = "none";
      alert("Erro ao enviar as fotos. Tente novamente.");
    }
  })();
}

// ----------------- EVENTOS -----------------
btnFazerVistoria?.addEventListener("click", () => {
  mostrarModal(modais.veiculo);
  startCamera();
});

veiculoBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.getAttribute("data-veiculo");
    fotosLista = tipo === "carro" ? fotosCarro : tipo === "moto" ? fotosMoto : fotosCarro;
    mostrarModal(modais.modo);
  });
});

btnIniciarEspecifica?.addEventListener("click", () => {
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

btnTodas?.addEventListener("click", () => {
  indiceFoto = 0;
  fotosLinks = [];
  mostrarFotoAtual();
});

btnEspecifica?.addEventListener("click", () => {
  listaFotosEspecificas.innerHTML = "";
  fotosLista.forEach((f, i) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${i}"> ${f.nome}`;
    listaFotosEspecificas.appendChild(label);
    listaFotosEspecificas.appendChild(document.createElement("br"));
  });
  mostrarModal(modais.especifica);
});

irCameraBtn?.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

tirarFotoBtn?.addEventListener("click", () => {
  const dataUrl = tirarFoto();
  fotoTiradaImg.src = dataUrl;
  fotosLinks[indiceFoto] = dataUrl;
  const fotoAtual = fotosLista[indiceFoto];
  fotoReferenciaResultado.src = fotoAtual.ref || "placeholder.png";
  proximaBtn.textContent = indiceFoto === fotosLista.length - 1 ? "Finalizar Vistoria" : "Próxima Foto";
  modalOverlay.style.display = "flex";
  mostrarModal(modais.resultado);
});

refazerBtn?.addEventListener("click", () => {
  fotosLinks[indiceFoto] = null;
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

proximaBtn?.addEventListener("click", () => {
  if (indiceFoto === fotosLista.length - 1) {
    mostrarLoading();
  } else {
    indiceFoto++;
    mostrarFotoAtual();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  mostrarModal(modais.instrucoes);
  startCamera();
});
