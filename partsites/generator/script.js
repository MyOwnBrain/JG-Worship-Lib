// filter

let filter = document.querySelectorAll("#filter");
let counts = document.querySelectorAll("#gen_count");
let type_wrapper = document.querySelectorAll("#type_wrapper");
let type_list = document.querySelectorAll("#type_list");
let active = false;

document.addEventListener("click", (e) => {
    if (
        !Object.values(type_list).includes(e.target) 
        && !Object.values(type_wrapper).includes(e.target) 
        && active === true
    ) close_lists()
})

function close_lists() {
    type_wrapper.forEach((i, key) => {
        active = false
        i.classList.remove("active")
        type_list[key].style.display = "none"
    })
}

function updateWrapperList() {
    type_wrapper.forEach((el, key) => {
        el.addEventListener("click", () => {
            close_lists()
            active = true;
            el.classList.add("active")
            type_list[key].style.display = "flex"

            let lis = document.querySelectorAll(`#type_list`)[key].children;

            Object.values(lis).forEach((eli) => {
                eli.addEventListener("click", () => {
                    active = false
                    el.classList.replace("active", "valid")
                    el.innerText = eli.textContent
                    type_list[key].style.display = "none"
                })
            })
        })
    })
}

updateWrapperList();

const filters = document.getElementById("filters");
const add_filter = document.getElementById("add_filter");

add_filter.addEventListener("click", () => {
    const child = document.createRange().createContextualFragment(`
        <div class="filter" id="filter">
            <input type="number" class="gen_count" id="gen_count" min="1" max="99" placeholder="count">
            <div class="type" id="type">
                <button class="type_wrapper" id="type_wrapper">
                    Type
                </button>
                <ul class="type_list" id="type_list">
                    <li>All</li>
                    <li>English</li>
                    <li>German</li>
                </ul>
            </div>
        </div>
    `)

    filters.appendChild(child)

    filter = document.querySelectorAll("#filter");
    counts = document.querySelectorAll("#gen_count");
    type_wrapper = document.querySelectorAll("#type_wrapper");
    type_list = document.querySelectorAll("#type_list");
    li = document.querySelectorAll("#type_list li");
    updateWrapperList();
})

// submit

const submit = document.getElementById("submit");

submit.addEventListener("click", () => setFilterValues())

let filter_values = {}

function setFilterValues() {
    for (let i = 0; i < filter.length; i++) {
        filter_values[i] = {
            count: parseInt(counts[i].value),
            lang: type_wrapper[i].textContent
        }
        counts[i].value = "",
        type_wrapper[i].innerText = "Type"
        type_wrapper[i].classList.remove("valid")
    }
    console.log(filter_values);
}