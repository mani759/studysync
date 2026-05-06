let buttons=document.querySelectorAll(".tab-btn");
let contents=document.querySelectorAll(".tab-content");

buttons.forEach(btn=>{
    btn.addEventListener("click",()=>{ 
        buttons.forEach(b=>b.classList.remove("active"));
        contents.forEach(c=>c.classList.remove("active"));


        btn.classList.add("active");

        let tab=btn.getAttribute("data-tab");
        document.getElementById(tab).classList.add("active");



    })
})