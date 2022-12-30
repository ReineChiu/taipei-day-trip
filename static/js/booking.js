const noReservation = document.querySelector(".no-reservation");
const haveReservation = document.querySelector(".have-reservation");
const booking_Trip = document.querySelector(".booking-trip");
const username = document.querySelector(".username");
const attractionName = document.querySelector(".attraction-name");
const bookingDate = document.querySelector(".booking-date");
const bookingTime = document.querySelector(".booking-time");
const bookingPrice = document.querySelector(".booking-price");
const bookingAddress = document.querySelector(".booking-address");
const bookingTotal = document.querySelector(".booking-total");
const bookingImage = document.querySelector(".trip-site-img");
const delBooking = document.querySelector(".garbage-button");
const submitBtn = document.querySelector(".submit");
const errorMes = document.querySelector(".error-mes");

const loadImage = document.querySelector(".lds-dual-ring");

const bookingUrl = '/api/booking';
const getUserUrl = '/api/user/auth';


function getUserData(){
    fetch(getUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.data != null){
            username.textContent = data.data.username;
            document.getElementById("user").value = data.data.username;
            document.getElementById("user-email").value = data.data.email;
        }else{
            location.href = "/";
        }
    })
    .catch((fail) => {
        location.href = "/";
    })
}
getUserData()

function getBookingData(){
    fetch(bookingUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.data != null){
            let total = 0;
            data.data.forEach((item, index) => { 
                haveReservation.style.display = "block";

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
                total = total+item.price;
                bookingTotal.textContent = "新台幣" + total + "元";

                // all
                const tripBox = document.createElement("div");
                tripBox.classList.add("trip-box");
                //圖片層
                const imageBox = document.createElement("div");
                imageBox.classList.add("trip-site-img");
                    // image
                const img = document.createElement("img");
                img.classList.add("image")
                img.src = item.images[0];

                // image preload
                img.onload = function() {
                    // console.log(123)
                    loadImage.style.display = "none";
                };
                //
           
                imageBox.appendChild(img);
                // 訊息層
                const messageBox = document.createElement("div");
                messageBox.classList.add("trip-site-message");
                const siteTitle = document.createElement("div");
                siteTitle.textContent = "臺北一日遊："+item.name;
                siteTitle.classList.add("site-title");
                const delBtn = document.createElement("div");
                const delImage = document.createElement("img");
                delBtn.classList.add("garbage-button");
                delImage.src = "static/image/icon_delete.png";
                delImage.classList.add(item.booking_id)

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
                mesDateTitle.textContent = "日期：";
                mesDate.textContent = appDate;
                const mesTimeTitle = document.createElement("span");
                const mesTime = document.createElement("span");
                mesTimeTitle.classList.add("mes-head");
                mesTime.classList.add("mes-content");
                mesTimeTitle.textContent = "時間：";
                mesTime.textContent = period;
                const mesFeeTitle = document.createElement("span");
                const mesFee = document.createElement("span");
                mesFeeTitle.classList.add("mes-head");
                mesFee.classList.add("mes-content");
                mesFeeTitle.textContent = "費用：";
                mesFee.textContent = "新台幣" + item.price + "元";
                const mesLocationTitle = document.createElement("span");
                const mesLocation = document.createElement("span");
                mesLocationTitle.classList.add("mes-head");
                mesLocation.classList.add("mes-content");
                mesLocationTitle.textContent = "地點：";
                mesLocation.textContent = item.address;

                delBtn.appendChild(delImage);
                dateBar.appendChild(mesDateTitle);
                dateBar.appendChild(mesDate);
                timeBar.appendChild(mesTimeTitle);
                timeBar.appendChild(mesTime);
                feeBar.appendChild(mesFeeTitle);
                feeBar.appendChild(mesFee);
                locationBar.appendChild(mesLocationTitle);
                locationBar.appendChild(mesLocation);

                messageBox.appendChild(siteTitle);
                messageBox.appendChild(dateBar);
                messageBox.appendChild(timeBar);
                messageBox.appendChild(feeBar);
                messageBox.appendChild(locationBar);

                tripBox.appendChild(imageBox);
                tripBox.appendChild(messageBox);
                tripBox.appendChild(delBtn);

                booking_Trip.appendChild(tripBox);

            })
            const del = document.querySelectorAll(".garbage-button")
            
            for(let i=0; i<del.length; i++){
                del[i].addEventListener("click", function(){            
                    let x = del[i].children[0];
                    bookingID = x.className;
                    const idData = {
                        choose : bookingID
                    }
                    booking_Trip.removeChild(this.parentNode);
                    fetch(bookingUrl,{
                        method : "DELETE",
                        headers : {"content-Type":"application/json"},
                        body : JSON.stringify(idData)      
                    },)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) =>{
                        if (data.message == null){
                            noReservation.style.display = "flex";
                            haveReservation.style.display = "none";
                        }
                    })
                })
            }
        }else{
            noReservation.style.display = "flex";
        }
    })
}  
getBookingData()

// -------------------- 金流 -------------------- //
TPDirect.setupSDK(
    126864, 
    "app_44HraoJ3CZINLAd3WLHW9Ccsze7Z1qEFrtEBQWtHPwsdiWlcnGIHtGyX8Lt4", 
    "sandbox"
);

TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: '#card-expiration-date',
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '卡片背面三碼'
        }

    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        ':focus':{
            'outline': '0'
        },
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
        isMaskCreditCardNumber: true,
        maskCreditCardNumberRange: {
            beginIndex: 6,
            endIndex: 11
        }    
})

const cardError = document.querySelector("card-content-error");

submitBtn.disabled = true;
TPDirect.card.onUpdate(update => {
    if (update.canGetPrime) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
 });


submitBtn.addEventListener("click", (event) =>{
    event.preventDefault();
    const nameValue = document.getElementById('user').value;
    const emailValue = document.getElementById('user-email').value;
    const phoneValue = document.getElementById('user-phone').value;
    const reName = document.querySelector(".name-errormes")
    const reEmail = document.querySelector(".email-errormes")
    const rePhone = document.querySelector(".phone-errormes")
    if (nameValue.length == 0){
        reName.textContent = "聯絡姓名為必填";
    }
    if (!(/^[A-za-z0-9\u4e00-\u9fa5]*$/.test(nameValue))){
        reName.textContent = "聯絡姓名為中文或英文大小寫(不可有特殊字元)";
    }
    if (emailValue.length == 0){
        reEmail.textContent = "聯絡信箱為必填";
    }
    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(emailValue))){
        reEmail.textContent = "聯絡信箱格式不正確";
    }
    if (phoneValue.length == 0){
        rePhone.textContent = "手機號碼為必填";
    }
    if (!(/^09\d{2}(\d{6}|-\d{3}-\d{3})$/.test(phoneValue))){
        rePhone.textContent = "手機號碼格式不正確";
    }else{
        // Get prime
        TPDirect.card.getPrime((result) => {
            fetch("/api/orders",{
                method : "POST",
                headers : {"content-Type":"application/json"},
                body : JSON.stringify(
                    {
                        prime : result.card.prime,
                        status : result.status,
                        contact_name : nameValue,
                        contact_email : emailValue,
                        contact_phone : phoneValue
                    })
            },)
            .then((response) => {
                return response.json();
            }).then((data) => {
                if (data.data) {
                    if (data.data.payment.status == 0) {
                        location.replace(`/thankyou?number=${data.data.number}`)
                    }else{
                        errorMes.style.display = "block";
                        errorMes.textContent = data.data.payment.message;
                    }
                }else{
                    errorMes.style.display = "block";
                    errorMes.textContent = data.message;
                }
            })
            .catch((fail) => {
                location.href = "/";
            })
        })
    }
})
