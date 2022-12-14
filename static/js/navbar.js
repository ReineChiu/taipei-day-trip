// 網頁載入時,顯示登入or登出鈕
const btnLog = document.querySelector(".log-button");
const btnLogin = document.createElement("button");
const btnLogout = document.createElement("button");
// 點擊登入/註冊鈕
const closeButton = document.querySelectorAll(".close-button");
const dialogSignupButton = document.querySelector(".signup-button");
const dialogLoginButton = document.querySelector(".login-button");

const overlay = document.querySelector(".overlay");
const dialog = document.querySelector(".dialog");

const dialogLoginContent = document.querySelector(".dialog-login-content");
const dialogSignupContent = document.querySelector(".dialog-signup-content");
// 點擊登入=>註冊
const showLogin = document.querySelector("#loginmessage");
const loginMessage = document.createElement("div");
const signup = document.querySelector(".dialog-signup-button");
// 點擊登入帳戶紐
const loginBtn = document.querySelector(".dialog-login-button");
// 點擊預定行程
const bookingTrip = document.querySelector(".booking");

const checkUserUrl = '/api/user/auth';
const userUrl = '/api/user';

window.onload = function() {
    fetch(checkUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (data.data != null){
                btnLogout.setAttribute("class","btn-logout");
                btnLogout.textContent = "登出系統";
                btnLog.appendChild(btnLogout);
            }else{
                btnLogin.setAttribute("class","btn-login");
                btnLogin.textContent = "登入/註冊";
                btnLog.appendChild(btnLogin);
            }
        })
    }

btnLog.addEventListener("click",() => {
    overlay.style.display = "block";
    dialog.style.display = "block";
});
closeButton.forEach(ele => {
    ele.addEventListener("click",() => {
        overlay.style.display = "none";
        dialog.style.display = "none";
    })
});
dialogSignupButton.addEventListener("click",() => {
    dialogSignupContent.style.display = "block";
    dialogLoginContent.style.display = "none";
})
dialogLoginButton.addEventListener("click",() => {
    dialogLoginContent.style.display = "block";
    dialogSignupContent.style.display = "none";
})


signup.addEventListener("click",() => {
    const nameValue = document.querySelector(".dialog-signup-name").value;
    const emailValue = document.querySelector(".dialog-signup-email").value;
    const passwordValue = document.querySelector(".dialog-signup-password").value;
    const signupData = {
        username : nameValue,
        email : emailValue,
        password : passwordValue
    };
    fetch(userUrl,{
        method : "POST",
        headers : {"content-Type":"application/json"},
        body : JSON.stringify(signupData)
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            const showSign = document.querySelector("#signmessage")
            const signMessage = document.createElement("div");
            const tip = document.querySelector(".tip")
            const signsusses = document.querySelector(".signsusses")
            while (showSign.hasChildNodes()){ 
                showSign.removeChild(showSign.firstChild);
            }
            if ("ok" in data){    
                tip.style.display = "none";
                signsusses.style.display = "block";        
            }else{
                signMessage.setAttribute("class", "erroressage");
                signMessage.textContent = "註冊失敗：" + data.message
                showSign.appendChild(signMessage);
            }
        })
})

loginBtn.addEventListener("click",() => {
    const loginEmail = document.querySelector(".dialog-login-email").value;
    const loginPassword = document.querySelector(".dialog-login-password").value;
    const logindata = {
        email : loginEmail,
        password : loginPassword,
    };
    fetch(checkUserUrl,{
        method : "PUT",
        headers : {"content-Type":"application/json"},
        body : JSON.stringify(logindata)
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            while (showLogin.hasChildNodes()){ 
                showLogin.removeChild(showLogin.firstChild);
            }
            if ("ok" in data){
                location.href = "/";
            }else{
                loginMessage.setAttribute("class", "erroressage");
                loginMessage.textContent = "登入失敗：" + data.message
                showLogin.appendChild(loginMessage);
            }
        })
},)

btnLogout.addEventListener("click",() => {
    fetch(checkUserUrl,{
        method : "DELETE",
        headers : {"content-Type":"application/json"}
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if ("ok" in data){
                location.href = "/";
            } 
        })
})

const frontPage = document.querySelector(".head-text")
frontPage.addEventListener("click",() => {
    location.href = "/";
})

bookingTrip.addEventListener("click",() => {
    fetch(checkUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (data.data != null){  
                location.href = "/booking";
            }else{
                overlay.style.display = "block";
                dialog.style.display = "block";
            }
        })
})  