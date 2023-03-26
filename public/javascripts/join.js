// ----------------meeting-join----------------


const tablinks = document.getElementsByClassName("tab-links")
const tabcontents = document.getElementsByClassName("content")

function openTab(tabname) {
    for (tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab")
    }
    document.getElementById(tabname).classList.add("active-tab")
}

// ----------------nav-toggle----------------

const navImg=document.querySelector(".nav-img");
const navToglle=document.querySelector(".nav-toggle")
const toggleOff=document.querySelector(".toggle-off")
var toggle=1;
navImg.addEventListener('click',()=>{
    if(toggle===1){
        navToglle.classList.add('active-toggle')
        toggle=0;
    }
    else{
        navToglle.classList.remove('active-toggle')
        toggle=1;
    }
})
