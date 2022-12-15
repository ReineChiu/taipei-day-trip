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
const delBooking = document.querySelector(".img-garbage");

const bookingUrl = '/api/booking';
const getUserUrl = '/api/user/auth';

getUserData()
function getUserData(){
    fetch(getUserUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data != null){
        username.textContent = data.data.username;
        document.getElementById("user").value = data.data.username;
        document.getElementById("user-email").value = data.data.email;
        }else{
            location.href = "/";
        }
    }).catch((fail) => {
        location.href = "/";
    })
}

getBookingData()
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
        }else{
            noReservation.style.display = "flex";
        }
    }).catch((fail) => {
        noReservation.style.display = "flex";
    })
}

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


