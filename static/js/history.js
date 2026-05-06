import { db, auth } from "/static/js/firebase.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadHistory(user) {
    const q=query(
        collection(db,"sessions"),
        where("userId","==",user.uid),
        orderBy("date","desc"),
    )

    const snapshot=await getDocs(q);
    const container=document.getElementById("historyList");

    container.innerHTML="";

    if(snapshot.empty){
        container.innerHTML="<p>No session is created yet<p>";
        return;

    }


    snapshot.forEach(doc => {

         let data = doc.data();

        // convert seconds → minutes
        let minutes = Math.floor(data.duration / 60);

        // convert timestamp → readable date
        let date = data.date.toDate().toLocaleString();


        let item = document.createElement("div");
        item.classList.add("history-item");

        item.innerHTML = `
            <div>
                <div class="history-date">${date}</div>
            </div>
            <div class="history-time">${minutes} min</div>
        `;

        container.appendChild(item);
    });
}

auth.onAuthStateChanged((user)=>{
    if(user){
        loadHistory(user);
    }    
})