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
let btn = document.querySelector(".menu_bar")
let nav = document.querySelector("nav")
let rota2 = document.querySelector(".a2")

//eventos
rota2.addEventListener("click", vis);
btn.addEventListener("click", openmenu);
//função open menu
function openmenu(){
    
    if(nav.style.width == "250px"){
        nav.style.width = "70px";
    }else{
        nav.style.width = "250px"
    }
};

function vis(){
    window.location.href = "../pages/vistoria.html"
}



