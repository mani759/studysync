import { db, auth } from "/static/js/firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


async function loadTotaltime(user) {

    const q= query(
        collection(db,"sessions"),
        where("userId","==",user.uid)
    )

    const snapshot=await getDocs(q);

    let total=0;
    snapshot.forEach(doc=>{
        total+=doc.data().duration;
    });

    let minutes=Math.floor(total/60);
    document.getElementById("totalTime").innerText=minutes+"min";
    document.getElementById("coins").innerText=total;
          
    
}

auth.onAuthStateChanged((user)=>{
    if(user){
        loadTotaltime(user);
    }
})