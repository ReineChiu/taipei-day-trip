const loadImage = document.querySelector(".lds-dual-ring");

let page = 0;
let keyword = "";
let isLoading = false;
const mainContent = document.querySelector(".main-content");
let nextpage = 0;

const getAttractionsData = async () =>{
    isLoading = true;
    let apiUrl = "";
    if(keyword){
        apiUrl = `/api/attractions?page=${page}&keyword=${keyword}`;
    }else{
        apiUrl = `/api/attractions?page=${page}`;
    }   
    const result = await fetch(apiUrl);
    const data = await result.json();
    if (data.data.length !== 0){
        const attractions = data.data;

        for (let att of attractions){
            // box
            const containAtt = document.createElement("a");
            containAtt.setAttribute("class","attraction") // 也可以寫成：containAtt.classList.add("grid-content");在創建的div中增加class="grid-content"
            containAtt.href = `/attraction/${att.id}`
            //圖片層
            const containImg = document.createElement("div");
            containImg.setAttribute("class","image-content");
            const img = document.createElement("img");
            img.setAttribute("class","image")
            img.src = att.images[0];


            img.onload = function() {
                console.log(123)
                // loadImage.style.display = "none";
            };
    


            const name = document.createElement("div");
            name.setAttribute("class","name");
            name.textContent = att.name;
            //資訊層
            const info = document.createElement("div");
            info.setAttribute("class","mark");
            const mrt = document.createElement("div");
            mrt.setAttribute("class","metro");
            mrt.textContent = att.mrt ? att.mrt : "無相鄰捷運站";
            const category = document.createElement("div");
            category.setAttribute("class","category");
            category.textContent = att.category;

            info.appendChild(mrt);
            info.appendChild(category);
            containImg.appendChild(name);
            containImg.appendChild(img);
            containAtt.appendChild(containImg);
            containAtt.appendChild(info);
            mainContent.appendChild(containAtt);
        }
    }else{
        mainContent.textContent = `查無該關鍵字 -${keyword}- 的資料！`; 
    }
    nextpage = data.nextpage;
    isLoading = false;
}

// ============= searchbar ============== //
function searchKeyword(){
    keyword = document.querySelector(".search").value;
    page = 0;
    const node = document.querySelector(".main-content");
    while (node.hasChildNodes()){ 
        node.removeChild(node.firstChild);
    }   
    getAttractionsData()
}
// =========== fetch 下一頁 ============= //
function loadNextPage(){
    // console.log(!nextpage)
    // console.log(nextpage)
    // console.log(!isLoading)`
    // console.log(isLoading)
    if(!nextpage || isLoading ){//nextpage === null 、isLoading === true作為需要明確判斷nextpage === null。可以改寫為!nextpage
        return
    }
    const scrollTop = window.pageYOffset; // 距離top垂直位移多少(變動)。等同window.scrollY紀錄網頁在捲軸的垂直方向位移量
    const clientHeight = document.documentElement.clientHeight; // 視窗目前顯示多少區域(高度)。固定
    const scrollHeight = document.documentElement.scrollHeight; // 目前視窗總高度(固定) 
    if(scrollTop + clientHeight > scrollHeight - 200){
        page = nextpage; 
        getAttractionsData();
    }
}
// 延遲
// const debounce = (func, wait=200) => {
//     let timeout;
//     return function executerFunction() {
//         const later = () => {
//             clearTimeout(timeout);
//             func();
//         }
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait)
//     }
// }
// 防抖函數
function debounce(fn, wait=100){
    let timeout = null;
    return function(){
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(fn, wait)
    }
}
// 設置監聽
window.addEventListener("scroll", debounce(loadNextPage))
// 呼叫第一頁(page=0)
getAttractionsData();

//============================== //
fetch(`/api/categories`).then((response) =>{
    return response.json();
}).then((data) =>{
    const cats = data.data;
    for (let cat of cats){
        const menu = document.querySelector(".category-box");
        const categoryBoxContent = document.querySelector(".category-box-content");
        const cate = document.createElement("div");
        cate.setAttribute("class","cate")
        cate.textContent = cat;
        categoryBoxContent.appendChild(cate);
        menu.appendChild(categoryBoxContent);
    }
    // ======== 監聽事件要放在 fetch之下 ========== //
    // ========     drop down menu    ========= //
    let show = document.querySelector(".search")
    const menu = document.querySelector(".category-box");

    show.addEventListener("click",function(event){
        menu.style.display = "block";
        event.stopPropagation();
    });
    document.addEventListener("click",function(){
        menu.style.display = "none";
    });
    menu.addEventListener("click",function(event){
        event.stopPropagation();
    })
    // ====================================== //
    const el = document.getElementsByClassName("cate");
    //用querySelector(".category-box")會造成點選空白出，輸入全部選項
    //改用getElementsByClassName("cate")，addEventListener可能不起作用，
    //原因是getElementsByClassName取得的可能是列表[]。解决的辦法是使用循環語句。
    const input = document.querySelector(".search");
    for (let i=0; i<el.length; i++){
        el[i].addEventListener("click", function(e){
            input.value = e.target.textContent;
            menu.style.display = "none";
        })
    }
})

