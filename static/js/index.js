
let page = 0;
let keyword = "";
let loadFetching = false;

const getAttractionsData = async () =>{
    let apiUrl = "";
    if(keyword){
        apiUrl = `/api/attractions?page=${page}&keyword=${keyword}`;
    }else{
        apiUrl = `/api/attractions?page=${page}`;
    }   
    const result = await fetch(apiUrl);
    const data = await result.json();
    nextpage = data["nextpage"];
    if (nextpage === null){ 
        loadFetching = true;
    }
    
    if (data["data"]){
        const mainContent = document.querySelector(".main-content");
        const attractions = data["data"];
        for (let att of attractions){
            const containAtt = document.createElement("div");
            containAtt.setAttribute("class","attraction") 
            //圖片層
            const containImg = document.createElement("div");
            containImg.setAttribute("class","image-content");
            const img = document.createElement("img");
            img.setAttribute("class","image")
            img.src = att.images[0];
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
    }   
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
        .catch(() => {
            const mainContent = document.querySelector(".main-content"); 
            mainContent.textContent = `查無該關鍵字 [${keyword}] 的資料！`;
        })
}
// =========== fetch 下一頁 ============= //
function loadNextPage(){
    if(loadFetching){
        return
    }
    const scrollTop = window.pageYOffset; 
    const clientHeight = document.documentElement.clientHeight; 
    const scrollHeight = document.documentElement.scrollHeight; 
    if(scrollTop + clientHeight > scrollHeight - 200){
        page++; 
        getAttractionsData();
    }
}
// 延遲
function debounce(fn, wait=200){
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

// ========     drop down menu    ========= //
fetch(`/api/categories`).then((response) =>{
    return response.json();
}).then((data) =>{
    const cats = data["data"];
    for (let cat of cats){
        const menu = document.querySelector(".menu-box");
        const cate = document.createElement("div");
        cate.setAttribute("class","cate")
        cate.textContent = cat;
        menu.appendChild(cate);
    }

    let show = document.querySelector(".search")
    const menu = document.querySelector(".menu-box");

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

    const el = document.querySelector(".menu-box");
    const input = document.querySelector(".search");
    el.addEventListener("click", function(e){
        input.value = e.target.textContent;
        menu.style.display = "none";
    })  
})




