
const images = document.querySelector(".images")
const nameCatMrt = document.querySelector(".name-catmrt");
const intro = document.querySelector(".intro");
const address = document.querySelector(".address");
const direction = document.querySelector(".direction");

const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let index = 0; 
let circle = document.querySelector(".circle");

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

fetch(apiUrl).then((response) =>{
    return response.json();
}).then((data) =>{
    const attraction = data["data"];
    const imgeUrls = attraction.images;
    document.title = attraction.name;
    for (let i=imgeUrls.length; i>0; i--){
        let imageAll = document.createElement("img");
        imageAll.style.zIndex = index;
        index++;
        imageAll.setAttribute("class","image")
        imageAll.src = imgeUrls[i-1];
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
    circleList[0].className = "current" 
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
                image[item].style.transition="opacity 2s"; 
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
                image[item].style.transition="opacity 2s";    
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
})
