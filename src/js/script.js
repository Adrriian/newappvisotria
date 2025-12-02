//apys do codigo

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

async function login(){
    email_input = document.querySelector('.email').value;
    password_input = document.querySelector(".password").value;
    let API_KEY = "napi_h1oxultl93gyplfy9bxw6titnf8x46a3jxlk1k2idu3iw2e4m1l32k6ot3cwldz0";
    let rest_endpoint = "https://ep-jolly-wildflower-ac6kwkbd.apirest.sa-east-1.aws.neon.tech/neondb/rest/v1";



    console.log("esse é o email digitado: " + email_input)

    try{
        const res = await fetch(`${rest_endpoint}/consultores`, {
            method: "GET",
            headers:{
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        })
        const dados = await res.json();

            
        if (dados.length === 0) {
        console.log("Email não encontrado");
        return false;
        }   
        
        console.log(dados)
      

    } catch (e) {
    console.error("Erro ao fazer login:", e);
    return false;
  }
}
