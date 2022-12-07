
const checkUserUrl = '/api/user/auth';

window.onload = function() {   
    const btnLogin = document.querySelector(".btn-login");
    const btnLogout = document.querySelector(".btn-logout");
    fetch(checkUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
        },)
        .then((response) => {
            //console.log(response)
            return response.json();
        }).then((data) => {
            console.log(data)
            console.log(data["data"])
            if (data["data"] != null){
                btnLogin.style.display = "none";
                btnLogout.style.display = "block";
            }else{
                btnLogin.style.display = "block";
                btnLogout.style.display = "none";
            }
        })
    }

const btnLogin = document.querySelector(".btn-login");
const closeButton = document.querySelectorAll(".close-button");

const dialogSignupButton = document.querySelector(".signup-button");
const dialogLoginButton = document.querySelector(".login-button");

const overlay = document.querySelector(".overlay");
const dialog = document.querySelector(".dialog");

const dialogLoginContent = document.querySelector(".dialog-login-content");
const dialogSignupContent = document.querySelector(".dialog-signup-content");

btnLogin.addEventListener("click",function(){
    overlay.style.display = "block";
    dialog.style.display = "block";
});
closeButton.forEach(ele => {
    ele.addEventListener("click",function(){
        overlay.style.display = "none";
        dialog.style.display = "none";
    })
});
dialogSignupButton.addEventListener("click",function(){
    dialogSignupContent.style.display = "block";
    dialogLoginContent.style.display = "none";
})
dialogLoginButton.addEventListener("click",function(){
    dialogLoginContent.style.display = "block";
    dialogSignupContent.style.display = "none";
})

const signup = document.querySelector(".dialog-signup-button");
const userUrl = '/api/user'

signup.addEventListener("click",function(){
    const nameValue = document.querySelector(".dialog-signup-name").value;
    const emailValue = document.querySelector(".dialog-signup-email").value;
    const passwordValue = document.querySelector(".dialog-signup-password").value;
    const signupdata = {
        name : nameValue,
        email : emailValue,
        password : passwordValue,
    };
    console.log(signupdata)
    fetch(userUrl,{
        method : "POST",
        headers : {"content-Type":"application/json"},
        body : JSON.stringify(signupdata)
        },)
        .then((response) => {
            console.log(response)
            return response.json();
        }).then((data) => {
            console.log(data)
            const showSign = document.querySelector("#signmessage")
            const signMessage = document.createElement("div");
            const tip = document.querySelector(".tip")
            const signsusses = document.querySelector(".signsusses")
            if ("ok" in data){    
                tip.style.display = "none";
                signsusses.style.display = "block";        
            }else{
                while (showSign.hasChildNodes()){ 
                    showSign.removeChild(showSign.firstChild);
                }
                signMessage.setAttribute("class", "erroressage");
                signMessage.textContent = "註冊失敗：" + data.message
                showSign.appendChild(signMessage);
            }
        })
})

const userAuthUrl = '/api/user/auth'
const loginBtn = document.querySelector(".dialog-login-button")

loginBtn.addEventListener("click",function(){
    const loginEmail = document.querySelector(".dialog-login-email").value;
    const loginPassword = document.querySelector(".dialog-login-password").value;
    const logindata = {
        email : loginEmail,
        password : loginPassword,
    };
    fetch(userAuthUrl,{
        method : "PUT",
        headers : {"content-Type":"application/json"},
        body : JSON.stringify(logindata)
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
            console.log(data["token"]);
            const showLogin = document.querySelector("#loginmessage");
            const loginMessage = document.createElement("div");
            if ("ok" in data){
                window.location.replace("http://3.217.7.0:3000")
            }else{
                while (showLogin.hasChildNodes()){
                    showLogin.removeChild(showLogin.firstChild);
                }
                loginMessage.setAttribute("class", "erroressage");
                loginMessage.textContent = "登入失敗：" + data.message
                showLogin.appendChild(loginMessage);
            }
        })
},)

const logoutUrl = '/api/user/auth'
const logoutBtn = document.querySelector(".btn-logout")
logoutBtn.addEventListener("click",function(){
    fetch(userAuthUrl,{
        method : "DELETE",
        headers : {"content-Type":"application/json"}
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if ("ok" in data){
                window.location.replace("http://3.217.7.0:3000")
            } 
        })
})

const frontPage = document.querySelector(".head-text")
frontPage.addEventListener("click",function(){
    window.location.replace("http://3.217.7.0:3000")
})