import { auth, db } from "/static/js/firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
window.addEventListener("DOMContentLoaded",()=>{

    //get attribute elements from study.html settings section...

    const timeInput=document.getElementById("studyTime");
    const timeDisplay=document.getElementById("timeDisplay");
    const saveBtn=document.getElementById("savePreferences");


    //live time update 
    timeInput.addEventListener("input",()=>{
        timeDisplay.innerText=`${timeInput.value} min`;
    })

    auth.onAuthStateChanged(async(user)=>{
        if(!user){
            return;
        }

        const ref=doc(db,"users",user.uid);
        const snap=await getDoc(ref);

        if(snap.exists()){
            const savedTime=snap.data().studyTime || 30;
            timeInput.value=savedTime;
            timeDisplay.innerText=`${savedTime} min`;
        }
    })

    saveBtn.addEventListener("click",async()=>{
        const user = auth.currentUser;
        if(!user){
            return;
        }

        const minutes=parseInt(timeInput.value);
        const ref=doc(db,"users",user.uid);
        await setDoc(ref,{studyTime:minutes},{merge:true});
        window.dispatchEvent(new Event("timeChanged"));
        
        const toast = document.getElementById("toast");

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 5000);
    })
    

    


})