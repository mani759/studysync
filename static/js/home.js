    import { auth, db } from "./firebase.js";

    import {
        doc,
        getDoc,
        collection,
        onSnapshot,
        query,
        where
    }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


    auth.onAuthStateChanged( async(user)=>{
        if(!user){
            return;
        }

        loadDashboard(user.uid);
    })

    async function loadDashboard(uid){

        const ref=doc(db,"users",uid);
        const userSnap= await getDoc(ref);
        let studyTime=5;
        if(userSnap.exists()){
            studyTime=userSnap.data().studyTime || 5;
        }

        document.getElementById("sessionDuration").innerText=`${studyTime}m`;


        const sessionRef=collection(db,'sessions');

        const q=query(
            sessionRef,
            where('userId',"==",uid)
        );


        onSnapshot(q,(snapshot)=>{
            let completedSessions=0;
            let totalMinutes=0;
            let incompleteSessions = 0;

            snapshot.forEach((doc) => {

                const session=doc.data();


                if(session.status==="completed"){
                    completedSessions++;
                }
                else if(session.status==="incomplete"){
                    incompleteSessions++;
                }

                totalMinutes+=Math.floor(session.duration/60);
                
            });

            document.getElementById("completedSessions").innerText=completedSessions;
            document.getElementById("totalHours").innerText=`${totalMinutes} m`;


            const goal=120;

            const progress=Math.min((totalMinutes/goal)*100,100);
            document.getElementById("goalProgress").innerText=`${Math.floor(progress)}%`;
            document.getElementById("textTimer").innerText=`${Math.floor(progress)}m/120m`;

            createChart(completedSessions,incompleteSessions);



            

        });

        



    }
    let chartInstance = null;


    function createChart(completed,incomplete){

        const canvas = document.getElementById("studyChart");

        const ctx = canvas.getContext("2d");



        // destroy old chart

        if(chartInstance){

            chartInstance.destroy();

        }



        // GREEN GRADIENT

        const greenGradient = ctx.createLinearGradient(0,0,0,400);

        greenGradient.addColorStop(0,"#22c55e");

        greenGradient.addColorStop(1,"rgba(34,197,94,0.2)");



        // RED GRADIENT

        const redGradient = ctx.createLinearGradient(0,0,0,400);

        redGradient.addColorStop(0,"#ef4444");

        redGradient.addColorStop(1,"rgba(239,68,68,0.2)");



        chartInstance = new Chart(ctx,{

            type:"bar",



            data:{

                labels:["Completed","Incomplete"],



                datasets:[

                    {

                        label:"Sessions",



                        data:[completed,incomplete],



                        backgroundColor:[

                            greenGradient,
                            redGradient
                        ],



                        borderRadius:12,



                        borderSkipped:false,



                        barThickness:90,



                        hoverBackgroundColor:[

                            "#16a34a",
                            "#dc2626"
                        ]

                    }

                ]

            },



            options:{

                responsive:true,



                maintainAspectRatio:false,



                animation:{

                    duration:1200,

                    easing:"easeOutQuart"
                },



                plugins:{

                    legend:{

                        display:false

                    },



                    tooltip:{

                        backgroundColor:"#111827",

                        titleColor:"#ffffff",

                        bodyColor:"#ffffff",

                        borderColor:"#374151",

                        borderWidth:1,

                        padding:12,

                        cornerRadius:12

                    }

                },



                scales:{

                    x:{

                        ticks:{

                            color:"#94a3b8",

                            font:{

                                size:14,

                                weight:"bold"
                            }

                        },



                        grid:{

                            display:false

                        },



                        border:{

                            display:false
                        }

                    },



                    y:{

                        beginAtZero:true,



                        ticks:{

                            color:"#94a3b8",

                            stepSize:1,



                            font:{

                                size:13
                            }

                        },



                        grid:{

                            color:"rgba(255,255,255,0.05)"
                        },



                        border:{

                            display:false
                        }

                    }

                }

            }

        });

    }