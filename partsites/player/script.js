const add = document.getElementById("add");
const add_window = document.getElementById("add_window");
const add_cancel = document.getElementById("add_cancel");
const add_submit = document.getElementById("add_submit");
const queue_list = document.getElementById("queue_list");
const video = document.getElementById("video");
let video_info;
let text;
let delete_li;

// add

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
        video_info[0].value = /[a-zA-Z0-9,./#+-]/g.test(video_info[0].value) ? video_info[0].value : "untitled";
        queue_list.innerHTML += `
            <li data-token="${video_info[1].value.split(/[=&]+/)[1]}" draggable="true">
                <span>${video_info[0].value}</span>
                <button><img src="../../images/player/trash.png" alt="trash"></button>
            </li>
        `
    } else {
        video_info[1].classList.add("invalid");
        return
    }

    add_window.style.display = "none";
    video_info[0].value = "";
    video_info[1].value = "";
    video_info[1].classList.remove("invalid");
    defDelete();

})

// delete form queue

function defDelete() {
    queue_list.querySelectorAll("li button").forEach((it) => {
        it.addEventListener("click", (e) => {
            e.composedPath()[1].remove();
        })
    })
}

// play

const play = document.getElementById("play");
const next = document.getElementById("next");
let song_index = 0;

play.addEventListener("click", () => {
    video.children.video_none.style.display = "none";
    updateIframe(song_index);
})

next.addEventListener("click", () => {
    song_index++;
    try {
        updateIframe(song_index);
    } catch {
        video.children.iframe.src = "https://";
        video.children.video_none.style.display = "block";
    }
})

function updateIframe(song_index) {
    video.children.iframe.src = "https://www.youtube.com/embed/" + queue_list.children[song_index].dataset.token;
    queue_list.children[song_index].style = `
        color: var(--placeholder);
        background: var(--dark-3);
    `;
}

// pause screen

const pause_screen_toggle = document.getElementById("pause_screen_toggle");
const pause_screen = document.getElementById("pause_screen");

pause_screen_toggle.addEventListener("click", () => {
    pause_screen.style.display = "flex";
})

pause_screen.addEventListener("dblclick", (e) => {
    pause_screen.style.display = "none"
})