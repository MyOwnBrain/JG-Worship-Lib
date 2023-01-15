const add = document.getElementById("add"),
    add_window = document.getElementById("add_window"),
    add_cancel = document.getElementById("add_cancel"),
    add_submit = document.getElementById("add_submit"),
    video = document.getElementById("video");
let video_info,
    text,
    delete_li;
    queue_list = document.getElementById("queue_list");

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
    reorderQueue();
})

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
        console.log(item)
        item.ondrag = handleDrag;
        item.ondragend = handleDrop;
    });
}

reorderQueue();

function handleDrag(item) {
    const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;

    selectedItem.classList.add("drag-active");
    let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

    if (list === swapItem.parentNode) {
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
    }
}

function handleDrop(item) {
    item.target.classList.remove("drag-active");
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
        updateIframe(song_index);
        song_index++;
    } catch {
        playerReset();
    }
})

function updateIframe(song_index) {
    video.children.iframe.src = "https://www.youtube.com/embed/" + queue_list.children[song_index].dataset.token;
    queue_list.children[song_index].style = `
        color: var(--placeholder);
        background: var(--dark-3);
    `;
}

function playerReset() {
    song_index = 0;
    Array.prototype.map.call(queue_list.children, (item) => {
        item.style = `
            color: var(--font-color);
            background: var(--dark-4);
        `;
    })
    video.children.iframe.src = "https://";
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