// ====== Configuração Firebase ======
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
const db = firebase.firestore();

// ====== Variáveis do HTML ======
const btn = document.querySelector(".menu_bar");
const nav = document.querySelector("nav");
const rota1 = document.querySelector(".a1");
const rota2 = document.querySelector(".a2");
const pesquisa = document.querySelector(".pesquisa");
const busca = document.querySelector(".busca");
const nomeClienteEl = document.querySelector(".name");
const placaClienteEl = document.querySelector(".plate");
const containerFotos = document.querySelector(".photo_area2"); // container para fotos
const dw = document.querySelector(".button_dw")

// ====== Eventos ======
btn.addEventListener("click", openmenu);
//função alterando o pesquisa
pesquisa.addEventListener('input', ()=>{
    pesquisa.value = pesquisa.value.toUpperCase()
})

rota1.addEventListener('click', () => {
    window.location.href = "../pages/cadastraruser.html";
});

rota2.addEventListener('click', () => {
    window.location.href = "../pages/link.html";
});
busca.addEventListener("click", async () => {
    const placa = pesquisa.value.trim();
    if (!placa) return alert("Digite a placa!");

    const resultado = await buscarVistoriaPorPlaca(placa);

    if (resultado.length === 0) {
        alert("Nenhuma vistoria encontrada para essa placa");
        return;
    }

    // Se houver mais de uma vistoria, exibir a mais recente
    let vistoriaParaExibir = resultado[0];
    if (resultado.length > 1) {
        resultado.sort((a, b) => b.criadoEm.seconds - a.criadoEm.seconds);
        vistoriaParaExibir = resultado[0];
    }

    exibirVistoria(vistoriaParaExibir);
});

// ====== Funções ======

// Função abrir/fechar menu lateral
function openmenu(){
    nav.style.width = nav.style.width === "250px" ? "70px" : "250px";
}

// Função que busca a vistoria filtrada pela placa e retorna JSON completo
async function buscarVistoriaPorPlaca(placaBusca) {
    const snapshot = await db.collection("vistoria")
                             .where("placa", "==", placaBusca)
                             .get();

    const resultado = [];

    for (const doc of snapshot.docs) {
        const dadosVistoria = doc.data();

        // Pega fotos diretamente do documento
        const fotos = dadosVistoria.fotos || [];

        resultado.push({
            id: doc.id,
            ...dadosVistoria,
            fotos: fotos
        });
    }

    console.log("Resultado completo:", resultado);
    return resultado;
}

// Função que exibe a vistoria no HTML
function exibirVistoria(vistoria) {
    nomeClienteEl.textContent = vistoria.nome;
    placaClienteEl.textContent = vistoria.placa;

    containerFotos.innerHTML = ""; // limpa fotos antigas
    vistoria.fotos.forEach(foto => {
        //div
        const card = document.createElement("div");
        card.classList.add("card");
        //div que altera o h1
        const h1_div = document.createElement("div")
        h1_div.classList.add("h1_div")
        //img                                   
        const img = document.createElement("img");
        img.src = foto.url;
        img.alt = foto.nome || foto.nomeArquivo || "";
        img.classList.add("photo_quadrada"); // opcional, para estilizar
        //h1
        const h1 = document.createElement("h1");
        h1.textContent = foto.nome || foto.nomeArquivo || "";
        h1.classList.add("h1_vistoria");
        
        // monta a estrutura
        card.appendChild(img);
        card.appendChild(h1_div);
        h1_div.appendChild(h1);
        
        containerFotos.appendChild(card);
    });
}

dw.addEventListener("click", baixar);

async function baixar() {
    const imagens = containerFotos.querySelectorAll("img");
    
    if(imagens.length === 0) {
        alert("Nenhuma foto para baixar!");
        return;
    }

    const zip = new JSZip();

    // Percorre todas as imagens e adiciona ao zip
    for (const img of imagens) {
        try {
            const url = img.src;
            const response = await fetch(url);
            const blob = await response.blob();

            // Nome do arquivo dentro do zip
            const nomeArquivo = img.alt ? img.alt.replace(/\s+/g, "_") + ".jpg" : url.split("/").pop();
            zip.file(nomeArquivo, blob);
        } catch (error) {
            console.error("Erro ao baixar imagem:", img.src, error);
        }
    }

    // Gera o ZIP e faz download
    zip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, "fotos_vistoria.zip");
    });
}





