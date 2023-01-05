const add = document.getElementById("add");
const add_window = document.getElementById("add_window");
const add_cancel = document.getElementById("add_cancel");
const add_submit = document.getElementById("add_submit");
const iframe = document.getElementById("iframe");

add.addEventListener("click", () => {
    add_window.style.display = "flex";
})

add_cancel.addEventListener("click", () => {
    add_window.style.display = "none";
})

add_submit.addEventListener("click", () => {
    add_window.style.display = "none";
    const video_link = add_window.querySelector("div input").value;
    if (video_link.startsWith("https://www.youtube.com/watch?v=")) {
        iframe.src = "https://www.youtube.com/embed/" + video_link.split(/[=&]+/)[1];
    } else {
        alert("Please paste youtube Video Link in there!")
    }
})