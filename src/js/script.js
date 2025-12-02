//apys do codigo

//variaveis de armazenamento dos inputs
let email_input = ""
let password_input = ""
// variaveis de armazenamento do banco de dados
let user = "";
let email_bd = "";
let password_bd = "";

// configuração Stack Auth e Neon
const STACK_PROJECT_ID = "894d54c0-8f95-4992-bee2-1070059c83d6";
const STACK_LOGIN_URL = `https://api.stack-auth.com/api/v1/projects/${STACK_PROJECT_ID}/login`;
const rest_endpoint = "https://ep-jolly-wildflower-ac6kwkbd.apirest.sa-east-1.aws.neon.tech/neondb/rest/v1/consultores";

//função teste
let btn = document.querySelector('.login_button');
btn.addEventListener("click", login);

// ---------------- FUNÇÃO LOGIN ----------------
async function login() {
    email_input = document.querySelector('.email').value;
    password_input = document.querySelector(".password").value;

    console.log("esse é o email digitado: " + email_input)

    try {
        // 1️⃣ Login Stack Auth
        const loginRes = await fetch(STACK_LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email_input,
                password: password_input
            })
        });

        if (!loginRes.ok) {
            console.log("Email ou senha incorretos no Stack Auth");
            return false;
        }

        const loginData = await loginRes.json();
        const tokenJWT = loginData.access_token;
        console.log("JWT recebido:", tokenJWT);

        // 2️⃣ Acessando Neon usando o JWT
        const res = await fetch(rest_endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${tokenJWT}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Erro ao acessar Neon:", res.status, res.statusText);
            return false;
        }

        const dados = await res.json();

        // 3️⃣ Filtrando usuário logado pelo email e senha
        const usuario = dados.find(u => u.email === email_input && u.senha === password_input);

        if (!usuario) {
            console.log("Email ou senha não encontrados na tabela Neon");
            return false;
        }

        // 4️⃣ Salvando dados do usuário
        user = usuario.nome || "";
        email_bd = usuario.email;
        password_bd = usuario.senha;

        console.log("Login bem-sucedido! Usuário:", usuario);

    } catch (e) {
        console.error("Erro ao fazer login:", e);
        return false;
    }
}
