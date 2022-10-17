size = "250"

$(document).on('mousemove', function(e){
    $('#light').css({"clip-path": `circle(${size}px at ${e.pageX}px ${e.pageY}px)`});
});

var intervalId = window.setInterval(function(){
    $('#dark-overlay').css({"opacity": Math.random()/5})
  }, 50);