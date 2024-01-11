// add to queue

const add = document.getElementById('add');
const add_window = document.getElementById('add_window');
const add_cancel = document.getElementById('add_cancel');
const add_submit = document.getElementById('add_submit');
let video_name = document.querySelectorAll('div input')[0];
let video_token = document.querySelectorAll('div input')[1];
let song_index = 0;

add.addEventListener('click', () => add_window.style.display = 'flex')

add_cancel.addEventListener('click', resetAddWindow)
add_submit.addEventListener('click', submitAddFormular)
video_name.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitAddFormular() })
video_token.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitAddFormular() })

function submitAddFormular() {
    if (video_token.value.startsWith('https://www.youtube.com/watch?v=')) {
        video_name.value = /[a-zA-Z0-9,./#+-]/g.test(video_name.value) ? video_name.value : 'untitled';
        addToQueue(video_token.value.split(/[=&]+/)[1], video_name.value)
    } else if (video_token.value.startsWith('https://youtu.be/')) {
        video_name.value = /[a-zA-Z0-9,./#+-]/g.test(video_name.value) ? video_name.value : 'untitled';
        addToQueue(video_token.value.split(/[/&?]+/)[2], video_name.value)
    } else {
        video_token.classList.add('invalid');
        return
    }

    resetAddWindow()
    initDeleteFromQueue()
    reorderQueue()
    applyClickToQueue()
}

video_token.addEventListener('input', () => video_token.classList.remove('invalid'))

let queue_list = document.getElementById('queue_list');

function addToQueue(token, name) {
    queue_list.innerHTML += `
        <li data-token='${token}' draggable='true'>
            <span>${name}</span>
            <button><img src='../../images/player/trash.svg' alt='trash'></button>
        </li>
    `
}

function resetAddWindow() {
    [video_name, video_token].forEach((item) => item.value = '');
    add_window.style.display = 'none'
    video_token.classList.remove('invalid')
}

// delete from queue

function initDeleteFromQueue() {
    queue_list.querySelectorAll('li button').forEach((del_btn, index) => {
        del_btn.addEventListener('click', (e) => {
            if (index <= song_index) song_index--;
            e.composedPath()[1].remove();
            reorderQueue();
            initDeleteFromQueue()
            applyClickToQueue()
        })
    })
}

// reorder queue

function handleDrag(item) {
    const selected_item = item.target;
    const list = selected_item.parentNode;
    const x = item.clientX;
    const y = item.clientY;

    selected_item.classList.add('drag-active');

    let played = Array.from(document.getElementsByClassName('played'));
    let swap_item = document.elementFromPoint(x, y) === null ? selected_item : document.elementFromPoint(x, y);

    if (played.includes(swap_item)) swap_item = selected_item

    if (list === swap_item.parentNode) {
        swap_item = swap_item !== selected_item.nextSibling ? swap_item : swap_item.nextSibling;
        list.insertBefore(selected_item, swap_item);
    }
}

function handleDrop(item) {
    item.target.classList.remove('drag-active')
    applyClickToQueue()
}

function reorderQueue() {
    Array.prototype.map.call(queue_list.children, (item) => {
        item.ondrag = handleDrag;
        item.ondragend = handleDrop;
    })
}

// copy queue url

const copy_queue = document.getElementById('copy');

copy_queue.addEventListener('click', () => {
    let token_list = [];
    let name_list = [];
    Array.from(queue_list.children).forEach((item) => {
        token_list.push(item.dataset.token)
        name_list.push(item.innerText)
    })

    let copy_url = `${window.location.origin + window.location.pathname}?queue_url=${token_list.join('§')}&queue_name=${name_list.join('§')}`

    if (token_list.length === 0) return;
    navigator.clipboard.writeText(copy_url);
})

// load queue from url

window.onload = () => {
    try {
        const params = new URLSearchParams(window.location.search)
        let load_url = params.get('queue_url').split('§')
        let load_name = params.get('queue_name').split('§')
        for (let i = 0; i < load_url.length; i++) addToQueue(load_url[i], load_name[i])
        initDeleteFromQueue()
        reorderQueue()
        applyClickToQueue()
    } catch { console.log('no queue preset') }
}

// play and select next video

const video = document.getElementById('video');
let iframe = document.getElementById('iframe');

function updateIframe(song_index) {
    iframe.src = 'https://www.youtube.com/embed/' + queue_list.children[song_index].dataset.token;
    queue_list.children[song_index].classList.add('played')
    queue_list.children[song_index].setAttribute('draggable', false)
}

function playerReset() {
    song_index = 0;
    Array.prototype.map.call(queue_list.children, (item) => {
        item.classList.remove('played')
        item.setAttribute('draggable', true)
    })
    iframe.src = 'https://';
    video.children.video_none.style.display = 'block';
    play.children[0].src = '../../images/sidebar/play.svg';
}

const play = document.getElementById('play');

function updateVideoDisplay() { video.children.video_none.style.display = 'none'; }
function setPlayButtonImage() { play.children[0].src = '../../images/player/stop.svg'; }

play.addEventListener('click', () => {
    if (queue_list.getElementsByClassName('played').length === 0) {
        updateVideoDisplay();
        setPlayButtonImage();
        updateIframe(song_index);
        song_index++;
    } else playerReset()
})

const next = document.getElementById('next');

next.addEventListener('click', () => {
    try {
        if (queue_list.getElementsByClassName('played').length === 0) {
            updateVideoDisplay();
            setPlayButtonImage();
        }
        updateIframe(song_index);
        song_index++;
    } catch (error) { playerReset(); }
})

let queue_list_li;

function applyClickToQueue() {
    queue_list_li = queue_list.querySelectorAll('li')
    queue_list_li.forEach((li, index) => {
        li.onclick = (e) => {
            if (e.target !== li) return;
            updateVideoDisplay();
            setPlayButtonImage();
            song_index = index;
            updateIframe(song_index)
            applyClickToQueue()
            queue_list_li.forEach((e, n) => {
                if (n <= index) {
                    e.classList.add('played')
                    e.setAttribute('draggable', false)
                } else {
                    e.classList.remove('played')
                    e.setAttribute('draggable', true)
                }
            })
        }
    })
}

// pause screen

const pause_screen_toggle = document.getElementById('pause_screen_toggle');
const pause_screen = document.getElementById('pause_screen');
let pause_screen_status = false;

pause_screen_toggle.addEventListener('click', () => {
    pause_screen.style.display = 'flex';
    pause_screen_status = true;
})

pause_screen.addEventListener('dblclick', () => {
    pause_screen.style.display = 'none';
    pause_screen_status = false;
})

// fullscreen

const header = document.querySelector('header')
const toggle_fullcsreen = document.querySelector('#fullscreen');
let fullscreen_status = false

toggle_fullcsreen.addEventListener('click', () =>
    fullscreen_status === false ?
        toggleFullscreen('none', 'none', '0.5rem', 'compress', true) :
        toggleFullscreen('block', 'flex', 'calc(var(--bar-size) + 1rem)', 'expand', false)
)

function toggleFullscreen(side, header_queue, top_left, img, status) {
    sidebar.style.display = side
    header.style.display = header_queue
    queue_list.parentElement.parentElement.style.display = header_queue
    main.style.top = top_left
    main.style.left = top_left
    toggle_fullcsreen.children[0].setAttribute('src', `../../images/player/${img}.svg`)
    fullscreen_status = status
}

// shortcuts

window.addEventListener('keyup', (e) => manageShortcuts(e))

function manageShortcuts(event) {
    if (!event.altKey) return;

    switch (event.code) {
        case 'Digit1':
            fullscreen_status === false ?
                toggleFullscreen('none', 'none', '0.5rem', 'compress', true) :
                toggleFullscreen('block', 'flex', 'calc(var(--bar-size) + 1rem)', 'expand', false)
            break;

        case 'Digit2':
            next.click()
            break;

        case 'Digit3':
            !pause_screen_status ? pause_screen_toggle.click() : pause_screen.dispatchEvent(new Event('dblclick'))
            break;
    }
}