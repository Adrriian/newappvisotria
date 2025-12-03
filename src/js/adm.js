let btn = document.querySelector(".menu_bar")
let nav = document.querySelector("nav")

btn.addEventListener("click", openmenu);

function openmenu(){
    
    if(nav.style.width == "250px"){
        nav.style.width = "70px";
    }else{
        nav.style.width = "250px"
    }
}
