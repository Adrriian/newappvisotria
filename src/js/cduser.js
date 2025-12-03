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

// variaveis
let btn = document.querySelector(".menu_bar");
let nav = document.querySelector("nav");
let rota1 = document.querySelector(".a1");
let rota2 = document.querySelector(".a2");

//eventos
rota1.addEventListener('click', () => {
    window.location.href = "../pages/vistoria.html"
});

rota2.addEventListener('click', () => {
    window.location.href = "../pages_adm/adm.html"
});

btn.addEventListener("click", openmenu)
//função open menu
function openmenu(){
    if(nav.style.width == "250px"){
        nav.style.width = "70px";
    }else{
        nav.style.width = "250px"
    }
}

auth.onAuthStateChanged(async user => {
  if (user) {
    console.log("UID:", user.uid);
    console.log("Email:", user.email);

    // Se quiser consultar o Firestore:
    const doc = await db.collection("usuarios").doc(user.uid).get();

    if (doc.exists) {
      const dados = doc.data();
      console.log("Dados do Firestore:", dados);

      // Exemplo: mostrando o nome no HTML
      document.querySelector(".nome-usuario").textContent = dados.nome;
    } else {
      console.log("Nenhum dado encontrado no Firestore.");
    }

  } else {
    // Se não estiver logado, manda para login
    window.location.href = "login.html";
  }
});
