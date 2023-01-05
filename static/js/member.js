
const userLogo = document.querySelector(".circle-text");
const userName = document.querySelector(".user-name");
const userEmail = document.querySelector(".user-email");


const searchOrder = document.querySelector(".search-image");
// 使用者圖像
const upimg = document.getElementById("upimg");

async function getData() {
    const options1 = {
        method: "GET",
        headers:{"content-Type":"application/json"}
    }
    const response1 = await fetch('/api/user/auth',options1);
    const data1 = await response1.json();
    if (data1.data != null){
        userLogo.textContent = data1.data.username.substr(0,1);
        userName.textContent = data1.data.username;
        userEmail.textContent = data1.data.email;
    }
    else{
        location.href = "/";
    }

    const options2 = {
        method: "GET",
        headers:{"content-Type":"application/json"}
    }
    const response2 = await fetch('/api/upload',options2);
    const data2 = await response2.json();
    if (data2.data != null){
        upimg.src = window.location.origin +"/"+data2.data.url;
        upimg.classList.add("upimg");
    }

}
getData()

const checkNum = document.getElementById('order-number');
const errorMes = document.querySelector(".error-text")

checkNum.addEventListener("click", () => {
    while (errorMes.hasChildNodes()){ 
        errorMes.removeChild(errorMes.firstChild);
    }    
})


const showRecord = document.querySelector(".show-record");
const recordInfoBox = document.createElement("div");
recordInfoBox.classList.add("record-info-box");

const recordTopMes = document.createElement("div");

searchOrder.addEventListener("click", () =>{
    const orderInput = document.getElementById('order-number').value;
    if (!(/^TDT\d{14}-\d{3}$/.test(orderInput))){
        errorMes.textContent = "訂單編號輸入格式不正確";
    }else{
        const orderData = {number : orderInput}
        fetch('api/order',{
            method : "POST",
            headers : {"content-Type":"application/json"},
            body : JSON.stringify(orderData)
        }).then(res => {
            return res.json();
        }).then(data => {
            while (showRecord.hasChildNodes()){ 
                showRecord.removeChild(showRecord.firstChild);
            }
        
            if (data.data != null) {
                recordTopMes.textContent = "訂單編號 " + orderInput ;
                recordTopMes.classList.add("record-top-mes");
                recordInfoBox.appendChild(recordTopMes);
        
                let total = 0;
                data.data.forEach((item, index) => {
                    let date = new Date(item.date); 
                    let y = date.getFullYear();
                    let mh = (date.getMonth()+1);
                    let d = date.getDate();
                    let appDate = (`${y}.${mh}.${d}`);
                    let period = "";
                    if (item.time === "morning"){
                        period = "早上八點到下午三點";
                    }else{
                        period = "下午一點到晚上八點"
                    }
                    // 建立單獨景點層
                    const dataInfoBox = document.createElement("div");
                    dataInfoBox.classList.add("data-info-box");
                        // 圖片層
                    const imageBox = document.createElement("div");
                    imageBox.classList.add("record-site-img");
                            // image
                    const img = document.createElement("img");
                    img.classList.add("image")
                    img.src = item.images[0];
                        // 資訊層
                    const infoBox = document.createElement("div");
                    infoBox.classList.add("record-site-info");
                    const infoTitle = document.createElement("div");
                    infoTitle.textContent = "訂購景點："+item.name;
                    infoTitle.classList.add("info-title");
                    const dateBar = document.createElement("div");
                    dateBar.classList.add("all-mes");
                    const timeBar = document.createElement("div");
                    timeBar.classList.add("all-mes");
                    const feeBar = document.createElement("div");
                    feeBar.classList.add("all-mes");
                    const locationBar = document.createElement("div");
                    locationBar.classList.add("all-mes");
                    const mesDateTitle = document.createElement("span");
                    const mesDate = document.createElement("span");
                    mesDateTitle.classList.add("mes-head");
                    mesDate.classList.add("mes-content");
                    mesDateTitle.textContent = "訂購日期：";
                    mesDate.textContent = appDate;
                    const mesTimeTitle = document.createElement("span");
                    const mesTime = document.createElement("span");
                    mesTimeTitle.classList.add("mes-head");
                    mesTime.classList.add("mes-content");
                    mesTimeTitle.textContent = "訂購時間：";
                    mesTime.textContent = period;
                    const mesFeeTitle = document.createElement("span");
                    const mesFee = document.createElement("span");
                    mesFeeTitle.classList.add("mes-head");
                    mesFee.classList.add("mes-content");
                    mesFeeTitle.textContent = "訂購費用：";
                    mesFee.textContent = "新台幣" + item.price + "元";
                    const mesLocationTitle = document.createElement("span");
                    const mesLocation = document.createElement("span");
                    mesLocationTitle.classList.add("mes-head");
                    mesLocation.classList.add("mes-content");
                    mesLocationTitle.textContent = "集合地點：";
                    mesLocation.textContent = item.address;

                    imageBox.appendChild(img);

                    dateBar.appendChild(mesDateTitle);
                    dateBar.appendChild(mesDate);
                    timeBar.appendChild(mesTimeTitle);
                    timeBar.appendChild(mesTime);
                    feeBar.appendChild(mesFeeTitle);
                    feeBar.appendChild(mesFee);
                    locationBar.appendChild(mesLocationTitle);
                    locationBar.appendChild(mesLocation);

                    infoBox.appendChild(infoTitle);
                    infoBox.appendChild(dateBar);
                    infoBox.appendChild(timeBar);
                    infoBox.appendChild(feeBar);
                    infoBox.appendChild(locationBar);

                    dataInfoBox.appendChild(imageBox)
                    dataInfoBox.appendChild(infoBox)

                    recordInfoBox.appendChild(dataInfoBox)

                    showRecord.appendChild(recordInfoBox)   
                
                    total = total+item.price;
                })
                const totalBox = document.createElement("div");
                totalBox.textContent = "已付款，新台幣"+ total +"元";
                totalBox.classList.add("total-box");
                recordTopMes.appendChild(totalBox);

            }else{
                const recordBox = document.createElement("div");
                recordBox.textContent = orderInput + " 查無該訂單資訊";
                showRecord.appendChild(recordBox);

            }
        })
    }
})


const usernameInput = document.querySelector(".username-input");
const usernameUpdate = document.createElement("input");
usernameUpdate.classList.add("username-update");
usernameUpdate.setAttribute("type", "text");
usernameUpdate.setAttribute("placeholder", "更改姓名？");

const cancel = document.createElement("img");
cancel.classList.add("cancel-arrow");
cancel.src = "static/image/left_arrow_icon.png";

const sendNewName = document.createElement("button");
sendNewName.classList.add("send-new-name");
sendNewName.textContent = "儲存";



// 點選 名字時 出現輸入框 ＋ (<-)
userName.addEventListener("click", () =>{
    while (usernameInput.hasChildNodes()){ 
        usernameInput.removeChild(usernameInput.firstChild);
    }
    usernameInput.appendChild(cancel);
    usernameInput.appendChild(usernameUpdate);
    usernameInput.appendChild(sendNewName);

    const newName = document.querySelector(".username-update");
    const send = document.querySelector(".send-new-name");
    const reName = document.querySelector(".name-errormes")

    newName.addEventListener("input", (e) =>{
        const newNameValue = e.target.value
        if (newNameValue.length != 0){
            sendNewName.style.display = "block";
            reName.style.display = "none";
        }
        if(newNameValue.length == 0){
            sendNewName.style.display = "none";
            reName.style.display = "none";
        }
    },false)  


    send.addEventListener("click", (e) =>{
        if (!(/^[A-za-z0-9\u4e00-\u9fa5]*$/.test(newName.value))){
            reName.style.display = "block";
            reName.textContent = "姓名為中文或英文大小寫(不可有特殊字元)";
        }else{
            fetch("/api/user/auth",{
                method : "PATCH",
                headers : {"content-Type":"application/json"},
                body : JSON.stringify({
                    newname : newName.value
                })
            }).then(res =>{
                return res.json();
            }).then(data =>{
                if ("ok" in data){
                    location.replace(`/member?id=${data.data.id}`)
                }
            })
        }
    },false)

})
cancel.addEventListener("click", () =>{
    while (usernameInput.hasChildNodes()){ 
        usernameInput.removeChild(usernameInput.firstChild);
    }
})

// 圖片上傳預覽
const fileUploader = document.querySelector("#file-uploader");

fileUploader.addEventListener("change", (e) => {
    let file = e.target.files[0]
    let reader = new FileReader();
    reader.onload = function(){
    upimg.src = reader.result;
    upimg.classList.add("upimg");
    };
    reader.readAsDataURL(e.target.files[0])

    let form = new FormData();    
    form.append('image',file)
    fetch('/api/upload',{
        method : "PUT",
        body : form
    },)
    .then((response) => {
        return response.json();
    }).then((data) => {
    })
    
})
