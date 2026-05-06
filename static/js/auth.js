import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { reload } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded",()=>{
const form=document.getElementById("signup-form");
console.log("Auth loaded");
if(form){
    form.addEventListener("submit",async function(e){
        e.preventDefault();
        const emailInput=document.getElementById("email-id");
        const passwordInput=document.getElementById("password-id");
        // console.log("signup-loaded");
        // console.log(email,password);
        if(!emailInput||!passwordInput){
            console.log("user details not found or empty!");
            return;
        }

        const email=emailInput.value;
        const password=passwordInput.value;
        const errorMsg=document.getElementById("error-msg");

        try{
            const userCred= await createUserWithEmailAndPassword(auth,email,password);
            console.log("user created", userCred.user.uid);
            console.log("Sending verification email...");
             console.log("Verification email sent"); 
            await sendEmailVerification(userCred.user);
            
            const user=userCred.user;
            errorMsg.textContent="email verification sent please check yur email inbox";
            const interval=setInterval(async ()=>{
                await user.reload();
                if(user.emailVerified){
                    clearInterval(interval);
                    window.location.href="/home";
                }
            },3000)
            // window.location.href="/";
            
        }
        catch(error){
            console.error("Error:",error.message)
            if(error.code==="auth/email-already-in-use"){
                errorMsg.textContent="Email already exists. Please login.";
            }
            else if(error.code==="auth/weak-password"){
                errorMsg.textContent="Password should be at least 6 characters.";
            }
            else{
               errorMsg.textContent="Something went wrong. Try again.";
            }
        }


        
    })
}
const loginForm=document.getElementById("login-form");
console.log("form",loginForm);
if(loginForm){
    loginForm.addEventListener("submit",async function(e){
        e.preventDefault();
        const email=document.getElementById("email-id").value;
        const password=document.getElementById("password-id").value;
        const errorMsg=document.getElementById("error-msg");
        try{
            const userCred=await signInWithEmailAndPassword(auth,email,password);
            if (!userCred.user.emailVerified) {
        errorMsg.textContent = "Please verify your email before logging in.";
    return;
}
            console.log("user logged in :",userCred.user.uid);
            errorMsg.textContent="";
            window.location.href="/home";
        }
        catch(error){
            console.error(error.message);
            if(error.code==="auth/user-not-found"){
                errorMsg.textContent="User not found please creat an accoutn or sign in";
            }
            else if(error.code==="auth/wrong-password"){
                errorMsg.textContent="Wrong password enetrd . Please check your password";
            }
            else if(error.code==="auth/invalid-credential"){
                errorMsg.textContent="invalid credentials , please check again !"
            }
            else{
                errorMsg.textContent="Something went wrong!";
            }
        }
    }
)
}



}
)


