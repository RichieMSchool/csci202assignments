function changeImage(element, file) {
    document.getElementById(element).href=file
    document.getElementById(element).innerHTML = `<img src="${file}" alt=""></img>`
}