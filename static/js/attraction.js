
const imgsContainer = document.querySelector(".img-container")
const nameCatMrt = document.querySelector(".name-catmrt");
const intro = document.querySelector(".intro");
const address = document.querySelector(".address");
const direction = document.querySelector(".direction");

const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
const price = document.querySelector(".price");

morning.addEventListener("click",function(){
    price.textContent="2000元"
});
afternoon.addEventListener("click",function(){
    price.textContent="2500元"
});

const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let index = 0;

let path = window.location.pathname 
let apiUrl = `/api`+ path;

fetch(apiUrl).then((response) =>{
    return response.json();
}).then((data) =>{
    const attraction = data["data"];
    const imgeUrls = attraction.images;
    
    for(img of imgeUrls){
        let image = document.createElement("img");
        image.setAttribute("class","image")
        image.src = img
        imgsContainer.appendChild(image);
    }

    let circle = document.querySelector(".circle");
    let num = 0;
    for (let i=0; i<imgeUrls.length; i++){
        let li = document.createElement("li");
        circle.appendChild(li)
        //點原點切換圖片(可以不使用)
        li.setAttribute("index", i)
        li.addEventListener("click", function(){
            for(let j=0; j<circle.children.length; j++){
                circle.children[j].className = "";
            }
            this.className = "current";
            num = this.getAttribute("index");
            image.src = imgeUrls[num];
        })
    }

    let image = document.querySelector("img");
    let circleList = document.querySelectorAll("li")
    circleList[0].className = "current"

    leftArrow.addEventListener("click",function(){
        index--;
        if (index <0){
            index = imgeUrls.length - 1;   
        }
        image.src = imgeUrls[index];
        for (let i=0; i<imgeUrls.length; i++){ 
            circleList[i].className = "";          
            circleList[index].className = "current";
        }        
    })
    rightArrow.addEventListener("click",function(){
        index++;
        if (index >imgeUrls.length - 1){
            index = 0;
        }
        image.src = imgeUrls[index];
        for (let i=0; i<imgeUrls.length; i++){
            circleList[i].className = "";
            circleList[index].className = "current";   
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
