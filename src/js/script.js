// Inicializa Firebase
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

//variaveis de armazenamento dos inputs
let email_input = ""
let password_input = ""
// variaveis de armazenamento do banco de dados
let user = "";
let email_bd = "";
let password_bd = "";

//função teste
let btn = document.querySelector('.login_button');
btn.addEventListener("click", login);

// ---------------- FUNÇÃO LOGIN ----------------
async function login() {
    email_input = document.querySelector(".email").value;
    password_input = document.querySelector(".password").value;
    let obs = documente.querySelector(".obs")
    if (!email_input || !password_input){
       obs.innerHTML = "Escreva o Email e Senha"
    }

    try {
      const users = await auth.signInWithEmailAndPassword(email_input, password_input);
      const uid = users.user.uid;
  
      // Pega dados do Firestore
      const dados = db.collection("consultores").doc(uid);
      const dadossalvos = await dados.get();

    
      if (dadossalvos.exists) {
        console.log("Dados do usuário:", dadossalvos.data());
      } else {
        console.log("Usuário logado, mas sem dados no Firestore!");
      } 
      } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Erro ao logar: " + error.message);
      }
}
