// ----------------Day-Night Mode----------------

const dayNight=document.querySelector(".day-night")
var changeMode=1;  
dayNight.addEventListener('click',()=>{
    dayNight.querySelector('i').classList.toggle("fa-moon")
    dayNight.querySelector('i').classList.toggle("fa-sun")
    document.body.classList.toggle("dark")
    
    // mode title
    if(changeMode===1){
        dayNight.setAttribute( 'title', 'Light mode' );
        changeMode=0;
    }else{
        dayNight.setAttribute( 'title', 'Dark mode' );
        changeMode=1
    }
})

window.addEventListener('load',()=>{
    if(document.body.classList.contains("dark")){
        dayNight.querySelector("i").classList.add("fa-moon")
    }
    else{
        dayNight.querySelector("i").classList.add("fa-sun")   
    }
})
