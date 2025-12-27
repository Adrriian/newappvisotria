// link.js - cria a vistoria no Firestore + gera link do cliente

// Firebase Inicialização
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

// Elements
let name_link = document.querySelector('.name_link');
let telphone_link = document.querySelector('.telphone');
let plate = document.querySelector('.plate');
let button_link = document.querySelector('.button_dw2');
const btn = document.querySelector(".menu_bar");
const nav = document.querySelector("nav");
const rota2 = document.querySelector(".a2");
btn.addEventListener("click", openmenu);

// função toUppercase
plate.addEventListener('input', ()=>{
    plate.value = plate.value.toUpperCase()
})
// Função abrir/fechar menu lateral
function openmenu(){
    nav.style.width = nav.style.width === "250px" ? "70px" : "250px";
}
rota2.addEventListener('click', async () => {
    const user = firebase.auth().currentUser;
    if (!user) return; // usuário já redirecionado se não estiver logado

    try {
        const cnDoc = await db.collection("consultores").doc(user.uid).get();
        const cnData = cnDoc.data();
        const cn_adm = cnData.adm;

        if (cn_adm === "true") {
            window.location.href = '../pages_adm/adm.html';
        } else {
            window.location.href = '../pages_adm/consultor.html';
        }
    } catch (error) {
        console.error("Erro ao verificar administrador:", error);
    }
});



button_link.addEventListener('click', gerar);

async function gerar() {
  let nomeCliente = name_link.value;
  let telefoneCliente = telphone_link.value;
  let placaCliente = plate.value;

  const user = auth.currentUser;
  if (!user) {
    alert("Erro: usuário não logado!");
    return;
  }

  // pegar dados do consultor
  const consultorRef = await db.collection("consultores").doc(user.uid).get();
  const dadosConsultor = consultorRef.data();

  // criar vistoria
  const docRef = await db.collection("vistoria").add({
    nome: nomeCliente,
    telefone: telefoneCliente,
    placa: placaCliente,
    uid_consultor: user.uid,
    whats_consultor: dadosConsultor.telefone || "",
    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
  });

  const idGerado = docRef.id;

  // gerar link para o cliente
   const linkFinal = `https://newappvistoria.netlify.app/src/pages/vistoria.html?vistoria=${idGerado}`;

  // enviar mensagem via WhatsApp
  let texto = encodeURIComponent(`Olá! Preciso que você realize a vistoria do veículo. Acesse o link abaixo:\n${linkFinal}`);
  window.location.href = `https://wa.me/55${telefoneCliente}?text=${texto}`;

  alert("Vistoria criada:", idGerado);
}