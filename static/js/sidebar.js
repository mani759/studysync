import { auth } from "/static/js/firebase.js";

import {signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const profileToggle=document.getElementById("profileToggle");
const profileDropdown=document.getElementById("profileDropdown");
const  logoutBtn=document.getElementById("logoutBtn");
const  profileName =document.getElementById("profileName");

auth.onAuthStateChanged((user)=>{
    if(user){
        const name=user.email.split("@")[0];
        profileName.innerText=name;

    }
})

profileToggle.addEventListener("click",()=>{
        if(profileDropdown.style.display==="block"){
            profileDropdown.style.display="none"; }
        else{
            profileDropdown.style.display='block';
        }
    })

    logoutBtn.addEventListener("click", async()=>{

        await signOut(auth);

        window.location.herf="/login";

    })
