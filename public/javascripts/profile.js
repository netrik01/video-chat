

// ----------------nav-toggle----------------

const navImg=document.querySelector(".nav-img");
const navToglle=document.querySelector(".nav-toggle")
const toggleOff=document.querySelector(".toggle-off")
const edit=document.querySelector(".edit-btn")
var toggle=1;
navImg.addEventListener('click',()=>{
    if(toggle===1){
        navToglle.classList.add('active-toggle')
        edit.style.display='none'
        toggle=0;
    }
    else{
        navToglle.classList.remove('active-toggle')
        edit.style.display='block'
        toggle=1;
    }
})

// ----------------update-section----------------
const topRight=document.querySelector(".top-right")
const updateSec=document.querySelector(".update-section")
const editbtn=document.querySelector(".edit-btn")
const closebtn=document.querySelector(".icon-close-update")
const btmMain=document.querySelector(".btm-main")

editbtn.addEventListener('click',()=>{
    topRight.classList.add('active-section');
    updateSec.classList.remove('active-update')
    btmMain.classList.add('active-position-update')
})
closebtn.addEventListener('click',()=>{
    topRight.classList.remove('active-section');
    updateSec.classList.add('active-update')
    btmMain.classList.remove('active-position-update')
})


// ----------------uploade-image----------------

const topLeft=document.querySelector(".top-left")
const closeBtnImg=document.querySelector(".icon-close-image")
const uploadImage=document.querySelector(".image-upload")

topLeft.addEventListener("click",()=>{
    topRight.classList.add('active-section');
    uploadImage.classList.remove('active-image')
    btmMain.classList.add('active-position-image')
    editbtn.style.display='none'
})
closeBtnImg.addEventListener("click",()=>{
    topRight.classList.remove('active-section');
    uploadImage.classList.add('active-image')
    btmMain.classList.remove('active-position-image')
    editbtn.style.display='block'
})
