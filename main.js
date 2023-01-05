const main = document.getElementById("main");

// scroll

const to_about = document.getElementById("to-about");
const about = document.getElementById("about");

to_about.addEventListener("click", () => {
    main.scrollTo({
        top: about.getBoundingClientRect().top - 50 - 10,
        left: 0,
        behavior: "smooth"
    })
})

const to_contact = document.getElementById("to-contact");
const contact = document.getElementById("contact");

to_contact.addEventListener("click", () => {
    main.scrollTo({
        top: contact.getBoundingClientRect().top - 50 - 10,
        left: 0,
        behavior: "smooth"
    })
})