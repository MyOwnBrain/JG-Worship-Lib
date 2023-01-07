// loading

const loader_window = document.getElementById("loader-window")
const loader_label = document.getElementById("loader-label")
const percent = document.getElementById("percent");

window.addEventListener("load", () => {
    let min_perc = 0;
    let max_perc = 100;

    let interval = setInterval(() => {
        min_perc++;
        
        percent.innerText = min_perc + "%";
        
        if (min_perc == max_perc) {
            clearInterval(interval);
        }
    }, 10)

    loader_label.style.transform = "translateX(0%)";
    
    setTimeout(() => {
        loader_window.style.opacity = "0%";
    }, 2000)
})