
const images = document.querySelector(".images")
const nameCatMrt = document.querySelector(".name-catmrt");
const intro = document.querySelector(".intro");
const address = document.querySelector(".address");
const direction = document.querySelector(".direction");

const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let index = 0; 
const circle = document.querySelector(".circle");

const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
const price = document.querySelector(".price");
morning.addEventListener("click",function(){
    price.textContent="2000元"
});
afternoon.addEventListener("click",function(){
    price.textContent="2500元"
});


let path = window.location.pathname; 
let apiUrl = `/api`+ path;

fetch(apiUrl).then((response) =>{
    return response.json();
}).then((data) =>{
    if ("ok" in data){
        const attraction = data.data;
        const imgeUrls = attraction.images;
        const loadImage = document.querySelector(".lds-dual-ring");
        document.title = attraction.name;
        for (let i=imgeUrls.length; i>0; i--){
            let imageAll = document.createElement("img");
            imageAll.style.zIndex = index;
            index++;
            imageAll.setAttribute("class","image")
            imageAll.src = imgeUrls[i-1];
            // image preload
            imageAll.onload = function() {
                loadImage.style.display = "none";
            };
            //
            images.appendChild(imageAll);     
        }   
        // 圓點=張數 
        for (let i=0; i<imgeUrls.length; i++){
            let li = document.createElement("li");
            circle.appendChild(li)
        }
        // 點Arrow，切換上下張
        let image = document.querySelectorAll(".image");
        let circleList = document.querySelectorAll("li")
        circleList[0].className = "current";
        //  
        for (let i=0; i<imgeUrls.length; i++){
            if (i != imgeUrls.length-1){
                image[i].style.opacity = 0;
            }else{
                image[i].style.opacity = 1;
            }
        }

        let page = 0; 
        let item = imgeUrls.length - 1; 
        leftArrow.addEventListener("click",function(){
            item++;
            if (item >imgeUrls.length - 1){
                item = 0;
            }
            for (i=0; i<imgeUrls.length; i++){
                if (i !== item){
                    image[i].style.opacity = 0;    
                }else{
                    image[item].style.opacity = 1; 
                }
            }
            //圓點隨圖片改動
            page--;
            if (page <0){
                page = imgeUrls.length- 1;   
            }
            for (let i=0; i<imgeUrls.length; i++){ 
                circleList[i].className = "";
                circleList[page].className = "current";
            }
        })
        rightArrow.addEventListener("click",function(){
            item--;
            if (item < 0){
                item = imgeUrls.length-1;   
            }
            for (i=imgeUrls.length-1; i>-1; i--){
                if (i === item){
                    image[item].style.opacity = 1;   
                }else{
                    image[i].style.opacity = 0;
                }
            }
            page++;
            if (page>imgeUrls.length-1){
                page = 0;
            }   
            for (let i=0; i<imgeUrls.length; i++){
                circleList[i].className = "";
                circleList[page].className = "current";   
            }  
        })

        const name = document.createElement("div");
        name.setAttribute("class","name");
        name.textContent = attraction.name;
        const cateAtMrt = document.createElement("div");
        cateAtMrt.setAttribute("class","cateAtMrt");
        if (attraction.mrt !== null){
            cateAtMrt.textContent = attraction.category +" at " + attraction.mrt;
        }else{
            cateAtMrt.textContent = attraction.category +" （附近無相鄰捷運站）"
        }    
        nameCatMrt.appendChild(name);
        nameCatMrt.appendChild(cateAtMrt);

        const description = document.createElement("div");
        description.setAttribute("class","description");
        description.textContent = attraction.description;
        const location = document.createElement("div");
        location.textContent = attraction.address;
        const trans = document.createElement("div");
        trans.textContent = attraction.direction;

        intro.appendChild(description);
        address.appendChild(location);
        direction.appendChild(trans);
    }
})
// ---------------------- booking 預定行程 ---------------------------- //
const bounceoverlay = document.querySelector(".overlay");
const bouncedialog = document.querySelector(".dialog");

const chooseDate = document.getElementById("date")
const dateErrHint = document.querySelector(".date-error-hint");
const errorHint = document.createElement("div")


chooseDate.addEventListener("click", () => {
    while (dateErrHint.hasChildNodes()){ //檢查node下是否有子元素
        dateErrHint.removeChild(dateErrHint.firstChild);
    }    
})

const checkUserAPI = '/api/user/auth';
const bookingCheck = document.querySelector(".submit");
bookingCheck.addEventListener("click", () => {
    const dateInput = document.getElementById("date").value;

    const timeInput = document.querySelector('input[name="time"]:checked').value;
    let priceInput = "";
    if (timeInput === "morning"){
        priceInput = 2000;
    }else{
        priceInput = 2500;
    }

    const attractionValue = path.split('/').slice(-1).toString()
    const bookingData = {
        date : dateInput,
        time : timeInput,
        price : priceInput,
        attractionId : attractionValue
    };

    let dateTime=new Date();
    dateTime.setDate(dateTime.getDate()+1);
    dateTime=new Date(dateTime);
    let date = new Date(dateTime);
    let y = date.getFullYear();
    let mh = (date.getMonth()+1);
    let d = date.getDate();
    let curDate = (`${y}-${mh}-${d}`);

    if (dateInput.length == 0){
        errorHint.textContent = "*必填";
        errorHint.classList.add("error-hint");
        dateErrHint.appendChild(errorHint);
        dateErrHint.style.display = "block";   
    }
    if ((Date.parse(dateInput)).valueOf() < (Date.parse(dateTime)).valueOf()){
        errorHint.textContent = "請選擇"+`${curDate}`+"之後的日期"
        errorHint.classList.add("error-hint");
        dateErrHint.appendChild(errorHint);
        dateErrHint.style.display = "block";   

    }else{
        fetch(checkUserAPI,{
            method : "GET",
            headers : {"content-Type":"application/json"},
        },)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (data.data != null){       
                const bookingAPI = '/api/booking';
                fetch(bookingAPI,{
                    method : "POST",
                    headers : {"content-Type":"application/json"},
                    body : JSON.stringify(bookingData)      
                },)
                .then((response) => {
                    return response.json();
                }).then((data) => {
                    if ("error" in data){
                        console.log(data.message)
                    }else{
                        location.href = "/booking";
                    }
                })
            }else{
                bounceoverlay.style.display = "block";
                bouncedialog.style.display = "block";
            }
        })
    }
})
