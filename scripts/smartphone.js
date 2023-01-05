const open_sidebar = document.getElementById("open-sidebar");
const close_sidebar = document.getElementById("close-sidebar");
const sidebar = document.getElementById("sidebar");

open_sidebar.addEventListener("click", () => {
    sidebar.style.left = "0";
})

close_sidebar.addEventListener("click", () => {
    sidebar.style.left = "-15.625rem";
})