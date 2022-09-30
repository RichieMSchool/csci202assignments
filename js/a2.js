darkmode = false;

function toggleDarkMode() {
    if (!darkmode) {
        for (i of document.querySelectorAll('*')) {
            i.classList.add("dark")
        }
    } else {
            for (i of document.querySelectorAll('*')) {
            i.classList.remove("dark")
        }
    }

    darkmode = !darkmode;
}