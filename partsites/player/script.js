const add = document.getElementById("add"),
    add_window = document.getElementById("add_window"),
    add_cancel = document.getElementById("add_cancel"),
    add_submit = document.getElementById("add_submit"),
    video = document.getElementById("video");
let video_info = add_window.querySelectorAll("div input"),
    text,
    delete_li,
    queue_list = document.getElementById("queue_list"),
    iframe = document.getElementById("iframe");

// add to queue

add.addEventListener("click", () => {
    add_window.style.display = "flex";
})

add_cancel.addEventListener("click", () => {
    add_window.style.display = "none";
    video_info.forEach((item) => {
        item.value = ""
    })
})

add_submit.addEventListener("click", () => {
    video_info = add_window.querySelectorAll("div input");

    if (video_info[1].value.startsWith("https://www.youtube.com/watch?v=")) {
        video_info[0].value = /[a-zA-Z0-9,./#+-]/g.test(video_info[0].value) ? video_info[0].value : "untitled";
        addToQueue(video_info[1].value.split(/[=&]+/)[1], video_info[0].value)
    } else {
        video_info[1].classList.add("invalid");
        return
    }

    add_window.style.display = "none";
    video_info[0].value = "";
    video_info[1].value = "";
    video_info[1].classList.remove("invalid");
    defDelete();
    reorderQueue();
})

function addToQueue(token, name) {
    queue_list.innerHTML += `
        <li data-token="${token}" draggable="true">
            <span>${name}</span>
            <button><img src="../../images/player/trash.png" alt="trash"></button>
        </li>
    `
}

// delete form queue

function defDelete() {
    queue_list.querySelectorAll("li button").forEach((it) => {
        it.addEventListener("click", (e) => {
            e.composedPath()[1].remove();
            reorderQueue();
        })
    })
}

// reorder queue

function reorderQueue() {
    queue_list = document.getElementById("queue_list");
    Array.prototype.map.call(queue_list.children, (item) => {
        item.ondrag = handleDrag;
        item.ondragend = handleDrop;
    });
}

reorderQueue();

function handleDrag(item) {
    const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = item.clientX,
        y = item.clientY;

    selectedItem.classList.add("drag-active");

    let played = Array.from(document.getElementsByClassName("played"));
    let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

    if (played.includes(swapItem)) {
        swapItem = selectedItem
    }

    if (list === swapItem.parentNode) {
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
    }
}

function handleDrop(item) {
    item.target.classList.remove("drag-active");
}

// copy queue url

const copy_queue = document.getElementById("copy");

copy_queue.addEventListener("click", () => {
    let token_list = [];
    let name_list = [];
    Array.from(queue_list.children).forEach((item) => {
        token_list.push(item.dataset.token)
        name_list.push(item.innerText)
    })

    let copy_url = `${window.location.href}?queue_url=${token_list.join("§")}&queue_name=${name_list.join("§")}`

    if (token_list.length === 0) return;
    navigator.clipboard.writeText(copy_url)
})

// load queue from url

window.onload = () => {
    try {
        const params = new URLSearchParams(window.location.search)
        let load_url = params.get("queue_url").split("§")
        let load_name = params.get("queue_name").split("§")
        for (let i = 0; i < load_url.length; i++) {
            addToQueue(load_url[i], load_name[i])
        }
    } catch (error) {
        console.log("no queue preset")
    }
}

// play

const play = document.getElementById("play");
const next = document.getElementById("next");
let song_index = 0;

play.addEventListener("click", () => {
    if (queue_list.children.length === 0) return;
    video.children.video_none.style.display = "none";
    if (song_index === 0) {
        updateIframe(song_index);
        play.children[0].src = "../../images/player/stop.png"
        song_index++;
    } else {
        playerReset();
    }
})

next.addEventListener("click", () => {
    try {
        if (song_index === 0) {
            video.children.video_none.style.display = "none";
            play.children[0].src = "../../images/player/stop.png"
        }
        updateIframe(song_index);
        song_index++;
    } catch {
        playerReset();
    }
})

function updateIframe(song_index) {
    iframe.src = "https://www.youtube.com/embed/" + queue_list.children[song_index].dataset.token;
    queue_list.children[song_index].classList.add("played")
    queue_list.children[song_index].setAttribute("draggable", false)
    iframe = document.getElementById("iframe")
}

function playerReset() {
    song_index = 0;
    Array.prototype.map.call(queue_list.children, (item) => {
        item.classList.remove("played")
        item.setAttribute("draggable", true)
    })
    iframe.src = "https://";
    video.children.video_none.style.display = "block";
    play.children[0].src = "../../images/sidebar/player.png";
}

// pause screen

const pause_screen_toggle = document.getElementById("pause_screen_toggle");
const pause_screen = document.getElementById("pause_screen");

pause_screen_toggle.addEventListener("click", () => {
    pause_screen.style.display = "flex";
})

pause_screen.addEventListener("dblclick", () => {
    pause_screen.style.display = "none"
})

// fullscreen

const header = document.querySelector("header")
const toggle_fullcsreen = document.querySelector("#fullscreen");
let fullscreen_status = false

toggle_fullcsreen.addEventListener("click", () => {
    switch (fullscreen_status) {
        case false:
            toggleFullscreen("none", "none", "0", 1, true)
            break
        case true:
            toggleFullscreen("block", "flex", "var(--bar-size)", 0, false)
            break
    }
})

function toggleFullscreen(side, header_queue, top_left, img_num, status) {
    sidebar.style.display = side
    header.style.display = header_queue
    queue_list.parentElement.parentElement.style.display = header_queue
    setTimeout(() => {
        main.style.top = top_left
        main.style.left = top_left
    }, 250);
    toggle_fullcsreen.children[0].setAttribute("src", `../../images/player/fullscreen${img_num}.png`)
    fullscreen_status = status
}