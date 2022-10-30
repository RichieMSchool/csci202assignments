// sheight = window.screen.height;
sheight = window.innerHeight
swidth = window.innerWidth;

console.log(sheight);
console.log(swidth)

ships = []
let i = 0;

$(document).ready(function () {

    for (let i = 0; i < window.innerHeight + window.innerWidth; i++) {
        $('body').append('<div class="star"></div>');
    }


    $('.star').each(function () {
        $(this).css({ "left": Math.random() * swidth, "top": Math.random() * sheight });
    });

    
    $('.sun').each(function () {
        $(this).css({ "left": Math.random() * (swidth - (.25 * swidth)) ,  "top": Math.random() * sheight - (.25 * sheight)});
    });

});

$.getJSON('http://api.open-notify.org/astros.json?callback=?', function (data) {
    var number = data['number'];
    $('#SpacePeople').html(number);

    data['people'].forEach(function (d) {

        if ($("#" + d['craft']).length == 0) {
            $('body').append(`<div class="ship" id=${d['craft']}><h1>${d['craft']}</h1></div>`);
            ships.push([d['craft'], swidth/2,  Math.random() * sheight/2, Math.random() + .25, Math.random() + .25]);
        }
        else {
            $("#" + d['craft']).append('<li>' + d['name'] + '</li>')
        }
    });


    $('.ship').each(function () {
        $(this).css({ "left": Math.random() * window.outerWidth/2, "top": Math.random() * window.outerHeight/2 });
    });

    var intervalId = window.setInterval(function() {
        ships.forEach(function(e) {

            ewidth = $('#' + e[0]).width() + 20; // +20  because border
            eheight = $('#' + e[0]).height();

            // move the ship
            e[1] += getdir(e[3]);

            // check if ship hits edges
            if (e[1] + ewidth >= swidth) {
                e[3] = -1 * (Math.random() + .25);
            }
            else if (e[1] <= 0) {
                e[3] = Math.random() + .25;
            }

            if (e[2] + eheight + 21>= sheight) {
                e[4] = -1 * (Math.random() + .25);
            }
            else if (e[2] <= 0) {
                e[4] = Math.random() + .25;
            }

            e[2] += getdir(e[4]);
            $('#' + e[0]).css({"left": `${e[1]}px`});
            $('#' + e[0]).css({"top": `${e[2]}px`});
        });
      }, 17);

});

  function getdir(dir) {
    return dir * 4;
  }
