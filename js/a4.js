size = "250"

hidden = true

$( document ).ready(function() {
    hidden = true
    $('#light').css({"opacity": 0});
    $('#circle').css({"opacity": 0});
    console.log("h galse")
});

$(document).on('mousemove', function(e){
    $('#light').css({"clip-path": `circle(${size}px at ${e.pageX}px ${e.pageY}px)`});
    $('#circle').css({"left": `${e.pageX - 350}px`, "top": `${e.pageY - 350}px`})
});

$(document).on('click', function(e) {
    console.log("click")
    if (hidden) {
        hidden = false;
        i = 1;
    }
    else {
        hidden = true
        i = 0
    }
    $('#light').css({"opacity": i});
    $('#circle').css({"opacity": i});
})

var intervalId = window.setInterval(function(){
    $('#dark-overlay').css({"opacity": Math.random()/5})
  }, 50);

