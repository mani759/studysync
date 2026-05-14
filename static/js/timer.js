import { db, auth } from "/static/js/firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let time=0.5*60;
let duration =time;
let interval=null;


window.addEventListener("DOMContentLoaded", () => {

    auth.onAuthStateChanged(async (user) => {
        if (!user) return;

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const minutes = snap.data().studyTime || 30;

            time = minutes * 60;
            duration = time;

            // refresh UI
        }
         else{

            time = 30 * 60;

            duration = time;

        }

         updateDisplay();
    });

});

// to update the timer display.....
function updateDisplay(){

       // get timer element
    const timerEl = document.getElementById("timer");

    // animation start
    timerEl.style.transform = "scale(0.95)";
    timerEl.style.opacity = "0.7";

    let minutes=Math.floor(time/60);
    let seconds=time%60;

     timerEl.innerText = `${minutes}:${seconds<10?"0":""}${seconds}`;
       setTimeout(() => {
        timerEl.style.transform = "scale(1)";
        timerEl.style.opacity = "1";
    }, 50);

   
    // document.getElementById("timer").innerText=`${minutes}:${seconds<10?"0":""}${seconds}`;

    let progress=((duration-time)/duration)*100;
    document.getElementById("progress").style.width=progress+"%";
    let elapsed=duration-time;
    let min=Math.floor(elapsed/60);
    let sec=(elapsed%60);
    document.getElementById('currentSession').innerText=`${min}:${sec<10?"0":""}${sec}`;

}

async function saveSessions(status) {
    try{

        let user = auth.currentUser;
        if(!user){
            console.log("no user logged in");
            return
        }

       let sessionData={
        duration:duration,
        status:status,
        date:new Date(),
        type:"study",
        userId: user.uid ,
        email:user.email,
       }

       let ref=collection(db,'sessions');

       await addDoc(ref,sessionData);
       console.log("saved");
    }

    catch(error){
        console.error(error);
    }
    
}



// to start the timer...........
function startTimer(){

    if(interval){
        return;
    }
    interval =setInterval(() =>{
        if(time<=0){
            clearInterval(interval);
            interval=null;
            document.getElementById("statusMsg").innerText="Session completed";
            saveSessions("completed");
            return;
        }

        time--;

        updateDisplay();
        
    },1000)
   
}

// to pause the timer..........
function pauseTimer(){
    clearInterval(interval);
    interval=null;
}


// to reset the timer..............
function resetTimer(){
    clearInterval(interval);
    interval=null;
     if(time !== duration){

        saveSessions("incomplete");

    }

    time=duration;
    document.getElementById("statusMsg").innerText="";
    updateDisplay();
}


window.addEventListener("timeChanged", async () => {

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    let minutes = 30;

    if (snap.exists()) {
        minutes = snap.data().studyTime || 30;
    }

    time = minutes * 60;
    duration = time;

    updateDisplay();
});




window.startTimer=startTimer;
window.pauseTimer=pauseTimer;
window.resetTimer=resetTimer;