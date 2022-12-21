
// 建立行程
const noReservation = document.querySelector(".no-reservation");
const haveReservation = document.querySelector(".have-reservation");
const username = document.querySelector(".username");
const attractionName = document.querySelector(".attraction-name");
const bookingDate = document.querySelector(".booking-date");
const bookingTime = document.querySelector(".booking-time");
const bookingPrice = document.querySelector(".booking-price");
const bookingAddress = document.querySelector(".booking-address");
const bookingTotal = document.querySelector(".booking-total");
const bookingImage = document.querySelector(".trip-site-img");
const bookingTripImage = document.createElement("img")
// 刪除行程
const delBooking = document.querySelector(".img-garbage");
// 確認訂購
const submitBtn = document.querySelector(".submit");
const errorMes = document.querySelector(".error-mes");

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

let orders
function getBookingData(){
    fetch(bookingUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data != null){
            const info = data.data;
            let date = new Date(info.date);
            let y = date.getFullYear();
            let mh = (date.getMonth()+1);
            let d = date.getDate();
            let appDate = (`${y}.${mh}.${d}`);
            let period = "";
            if (info.time === "morning"){
                period = "早上八點到下午三點";
            }else{
                period = "下午一點到晚上八點"
            }
            haveReservation.style.display = "block";
            attractionName.textContent = info.attraction.name;
            bookingTripImage.src = info.attraction.image;
            bookingTripImage.setAttribute("class","image")
            bookingImage.appendChild(bookingTripImage)
            bookingDate.textContent = appDate;
            bookingTime.textContent = period;
            bookingPrice.textContent = "新台幣" + info.price + "元";
            bookingAddress.textContent = info.attraction.address;
            bookingTotal.textContent = "新台幣" + info.price + "元";
            //
            orders = {
                "price" : info.price,
                "trip" : {
                    "attraction" :{
                        "id" : info.attraction.id,
                        "name" : info.attraction.name,
                        "address" : info.attraction.address,
                        "image" : info.attraction.image,
                    },
                    "date" : appDate,
                    "time" : info.time
                }
            }
        }else{
            noReservation.style.display = "flex";
        }
    }).catch((fail) => {
        noReservation.style.display = "flex";
    })
}
getBookingData()

// -------------------- 點擊刪除 ------------------------ //
delBooking.addEventListener("click",() => {
    fetch(bookingUrl,{
        method : "DELETE",
        headers : {"content-Type":"application/json"},
    },)
    .then((response) => {
        return response.json();
    }).then((data) => {
        if ("ok" in data){
            noReservation.style.display = "flex";
            haveReservation.style.display = "none";
        }
    })
})

// -------------------- 金流 -------------------- //
TPDirect.setupSDK(
    126864, 
    "app_44HraoJ3CZINLAd3WLHW9Ccsze7Z1qEFrtEBQWtHPwsdiWlcnGIHtGyX8Lt4", 
    "sandbox"
);

TPDirect.card.setup({
    fields: {
        number: {
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '卡片背面三碼'
        }

    },
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        'input.expiration-date': {
            'font-size': '16px'
        },
        ':focus':{
            'outline': '0'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
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
    }
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
                    contact_phone : phoneValue,
                    data : orders
                })
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (data.data) {
                if (data.data.payment.status == 0) {
                    window.location.replace(`/thankyou?number=${data.data.number}`)
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
})
