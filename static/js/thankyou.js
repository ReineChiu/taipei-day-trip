
const username = document.querySelector(".username");
const successPage = document.querySelector(".success");
const errorPage = document.querySelector(".error");

const errorMessage = document.createElement("div");
const orderNum = document.querySelector(".order-number");

let Url = location.href;
let getUrlStr = new URL(Url)
let orderNumber = getUrlStr.searchParams.get("number");
console.log(orderNumber)
const getOrderUrl = `/api/order/${orderNumber}`;

function getData(){
    fetch(getOrderUrl,{
        method : "GET",
        headers : {"content-Type":"application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if(data.data != null){
            username.textContent = data.data.name;
            orderNum.textContent = data.data.number;
        }
        else{
            errorPage.style.display = "block";
            successPage.style.display = "none";
            username.textContent = data.data.name;
        }
    })
}
getData()