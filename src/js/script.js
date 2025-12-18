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

// variáveis de armazenamento dos inputs
let email_input = "";
let password_input = "";
//let do mostar senha
let img_passwords = document.querySelector(".img_passord");

// botão de login
const btn = document.querySelector('.login_button');
btn.addEventListener("click", login);

//function mostrar senha
img_passwords.addEventListener("click", () => {
    if(img_passwords.src.includes("src/images/fechado.png")){
        img_passwords.style.width = "300px"
    }
} )
// ---------------- FUNÇÃO LOGIN ----------------
async function login() {
    email_input = document.querySelector(".email").value.trim();
    password_input = document.querySelector(".password").value.trim();
    const obss = document.querySelector(".obs");

    // Verifica campos vazios
    if (!email_input && !password_input) {
        obss.textContent = "Você precisa digitar o email e senha";
        return;
    }
    if (!email_input) {
        obss.textContent = "Você precisa digitar o email";
        return;
    }
    if (!password_input) {
        obss.textContent = "Você precisa digitar a senha";
        return;
    }

    try {
        // Tenta logar
        const users = await auth.signInWithEmailAndPassword(email_input, password_input);
        const uid = users.user.uid;

        // Pega dados do Firestore
        const dados = await db.collection("consultores").doc(uid).get();

        if (!dados.exists) {
            obss.textContent = "Email ou senha incorretos";
            return;
        }

        const adm = dados.data().adm;

        // Redireciona conforme tipo de usuário
        if (adm === "true") {
            window.location.href = "src/pages_adm/adm.html";
        } else {
            window.location.href = "src/pages_adm/consultor.html";
        }

    } catch (error) {
        console.error("Erro ao logar:", error);
        obss.textContent = "Email ou senha incorretos";
    }
}
