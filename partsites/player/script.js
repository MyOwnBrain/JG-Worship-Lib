const add = document.getElementById("add");
const add_window = document.getElementById("add_window");
const add_cancel = document.getElementById("add_cancel");
const add_submit = document.getElementById("add_submit");
const queue_list = document.getElementById("queue_list");
const video = document.getElementById("video");
let video_info;
let text;

add.addEventListener("click", () => {
    add_window.style.display = "flex";
})

add_cancel.addEventListener("click", () => {
    add_window.style.display = "none";
    video_info[1].value = "";
})

add_submit.addEventListener("click", () => {
    video_info = add_window.querySelectorAll("div input");
    
    if (video_info[1].value.startsWith("https://www.youtube.com/watch?v=")) {
        video_info[0].value = /[^*a-zA-Z0-9,./#+-]*$/g.test(video_info[0].value) ? "untitled" : video_info[0].value;
        queue_list.innerHTML += `<li data-token="${video_info[1].value.split(/[=&]+/)[1]}" draggable="true">${video_info[0].value}</li>`
    } else {
        video_info[1].classList.add("invalid");
        return
    }

    add_window.style.display = "none";
    video_info[0].value = "";
    video_info[1].value = "";
    video_info[1].classList.remove("invalid")
})

/*
video.children.iframe.src = "https://www.youtube.com/embed/" + video_link.value.split(/[=&]+/)[1];

video.children.video_none.style.display = "none"
*/