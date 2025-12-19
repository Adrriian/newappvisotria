// Dados Firebase
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
console.log("Auth:", firebase.auth());
console.log("Firestore:", firebase.firestore());
console.log("Usuário logado:", firebase.auth().currentUser);

// Parte js do cadastraruser.html

// variaveis
let btn = document.querySelector(".menu_bar");
let nav = document.querySelector("nav");
let rota1 = document.querySelector(".a1");
let rota2 = document.querySelector(".a2");
let button = document.querySelector(".button_dw");
//variaveis de cadastro
const name_input = document.querySelector(".name");
const cpf_input = document.querySelector(".cpf");
const email_input = document.querySelector(".email");
const senha_input = document.querySelector(".senha");
const telefone_input = document.querySelector(".telefone");


//eventos
btn.addEventListener("click", openmenu)
button.addEventListener("click", cadastrar)

//eventos e funções juntas

//function gerar link
rota1.addEventListener('click', () => {
    window.location.href = "../pages/link.html"
});

//function rota adm.html ou consultor.html
rota2.addEventListener("click", async () => {
  try {
    // 1) Verifica se já existe usuário logado
    const user = auth.currentUser;

    if (!user) {
      alert("Nenhum usuário logado!");
      return;
    }

    const uid = user.uid;

    // 2) Pega dados no Firestore
    const docRef = db.collection("consultores").doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      alert("Usuário sem dados na coleção consultores.");
      return;
    }

    const data = docSnap.data();

    // 3) Verifica se é adm
    const isAdm = data.adm === true || data.adm === "true";

    // 4) Redireciona
    if (isAdm) {
      window.location.href = "../pages_adm/adm.html";
    } else {
      window.location.href = "../pages_adm/consultor.html";
    }

  } catch (error) {
    console.error("Erro:", error);
  }
});
//functions


//função open menu
function openmenu(){
    if(nav.style.width == "250px"){
        nav.style.width = "70px";
    }else{
        nav.style.width = "250px"
    }
}

 //função de pegar o radio
  let radio_input = "";
  const adm_input = document.querySelectorAll('.adm[name="option"]');
  adm_input.forEach(radio =>{
    radio.addEventListener("change", ()=>{
      radio_input = radio;
      console.log(`seu radio é ola: ` + radio_input.value);
    })
  })
// Funciton cadastrar
async function cadastrar() {
  const name = name_input.value;
  const cpf = cpf_input.value;
  const email = email_input.value;
  const senha = senha_input.value;
  const telefone = telefone_input.value;
  const adm = radio_input.value;

  console.log(adm)

  try {
      // 1) cria usuário no Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
    const uid = userCredential.user.uid;

    await db.collection("consultores").doc(uid).set({
      name,
      email,
      cpf,
      telefone,
      adm,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("usuario criado")
  } catch (error) {
    console.error(error);
  alert("usuario não criado")
  }
}




