const logBtn = document.querySelector(".log-button");
const btnLogin = document.querySelector(".btn-login");
const btnLogout = document.querySelector(".btn-logout");
const dropDown = document.querySelector(".dropdown") 
const closeButton = document.querySelectorAll(".close-button");
const dialogSignupButton = document.querySelector(".signup-button");
const dialogLoginButton = document.querySelector(".login-button");

const overlay = document.querySelector(".overlay");
const dialog = document.querySelector(".dialog");

const dialogLoginContent = document.querySelector(".dialog-login-content");
const dialogSignupContent = document.querySelector(".dialog-signup-content");
const showLogin = document.querySelector("#loginmessage");
const loginMessage = document.createElement("div");
const signup = document.querySelector(".dialog-signup-button");
const loginBtn = document.querySelector(".dialog-login-button");
const bookingTrip = document.querySelector(".booking");
const memberCentre = document.querySelector(".member-centre");

const checkUserUrl = '/api/user/auth';
const userUrl = '/api/user';

// -------------- 網頁載入時 -------------------- //
window.onload = function() {
    fetch(checkUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (data.data != null){
                dropDown.style.display = "block";
                logBtn.style.display = "none";
            }else{
                btnLogin.style.display = "block";
                logBtn.style.display = "none";
            }
        })
    }
// ---------------- 點擊 登入/註冊 ------------------ //
btnLogin.addEventListener("click",() => {
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

// ---------------------點擊註冊---------------------------- //
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

// ---------------------點擊登入---------------------------- //
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
// ---------------------點擊登出---------------------------- //
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
// ---------------------- 回首頁 ---------------------------- //
const frontPage = document.querySelector(".head-text")
frontPage.addEventListener("click",() => {
    location.href = "/";
})

// ---------------------- 點擊預定行程 ----------------------- //
bookingTrip.addEventListener("click",() => {
    fetch(checkUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
        },)
        .then(response => {
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

// ---------------------- 點擊會員中心 ----------------------- //
const clickToCheckUser = async() => {
    const res = await fetch(checkUserUrl);
    const data = await res.json();
    if (data.data != null){
        location.replace(`/member?id=${data.data.id}`)
    }else{
        location.href = "/";
    }
}
memberCentre.addEventListener("click", clickToCheckUser)

