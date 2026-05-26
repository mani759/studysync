import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let draggedId=null;



const modal =
document.getElementById("taskModal");



document
.getElementById("openModalBtn")
.onclick=()=>{

    modal.style.display="flex";

};



document
.getElementById("closeModalBtn")
.onclick=()=>{

    modal.style.display="none";

};



auth.onAuthStateChanged((user)=>{

    if(!user) return;

    loadTasks(user.uid);

});



document
.getElementById("saveTaskBtn")
.onclick=async()=>{

    const user=auth.currentUser;

    await addDoc(
        collection(db,"tasks"),
        {

            title:
            document
            .getElementById("taskTitle")
            .value,

            description:
            document
            .getElementById("taskDesc")
            .value,

            deadline:
            document
            .getElementById("taskDeadline")
            .value,

            priority:
            document
            .getElementById("taskPriority")
            .value,

            status:"backlog",

            userId:user.uid,

            createdAt:new Date()

        }
    );

    modal.style.display="none";

};



function loadTasks(uid){

    const q=query(
        collection(db,"tasks"),
        where("userId","==",uid)
    );



    onSnapshot(q,(snapshot)=>{

        document.getElementById(
        "backlogTasks").innerHTML="";

        document.getElementById(
        "progressTasks").innerHTML="";

        document.getElementById(
        "doneTasks").innerHTML="";



        let total=0;
        let progress=0;
        let done=0;



        snapshot.forEach((d)=>{

            const task=d.data();

            total++;

            if(task.status==="progress") progress++;

            if(task.status==="done") done++;



            renderTask(task,d.id);

        });



        document.getElementById(
        "totalTasks").innerText=total;

        document.getElementById(
        "progressCount").innerText=progress;

        document.getElementById(
        "doneCount").innerText=done;

    });

}



function renderTask(task,id){

    const card=document.createElement("div");

    card.className="task-card";

    card.draggable=true;



    card.innerHTML=`

        <h3>${task.title}</h3>

        <p>${task.description}</p>

        <span class="priority ${task.priority}">
            ${task.priority}
        </span>

        <p>${task.deadline}</p>

    `;



    card.addEventListener(
        "dragstart",
        ()=>{

            draggedId=id;

        }
    );



    const target=
        task.status==="backlog"
        ? "backlogTasks"
        : task.status==="progress"
        ? "progressTasks"
        : "doneTasks";



    document
    .getElementById(target)
    .appendChild(card);

}



document
.querySelectorAll(".column")
.forEach((column)=>{

    column.addEventListener(
        "dragover",
        (e)=>{

            e.preventDefault();

        }
    );



    column.addEventListener(
        "drop",
        async()=>{

            await updateDoc(
                doc(db,"tasks",draggedId),
                {
                    status:
                    column.dataset.status
                }
            );

        }
    );

});