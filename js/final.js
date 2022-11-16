sheight = window.innerHeight;
swidth = window.innerWidth;
init = false;

speed = 1;
distance = 0;

playerX = 0;
playerY = 0;

curX = 0;
curY = 0;

// Move Clouds
window.setInterval(function(){
    if (!document.hasFocus()) {
        return
    }

    $('.cloudpiece').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove(); 
        }
        $(this).css({"left": `${pos.left - ((swidth/(800 + (Math.random() * 800 / speed))) * speed)}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 20px 20px #103243`});
    });

  }, 17);

  // Move Houses
window.setInterval(function(){
    if (!document.hasFocus()) {
        return
    }
    
    $('.house').each(function () {
        pos = $(this).position();

        if (pos.left + 200 <= 0) {
            $(this).remove(); 
        }

        $(this).css({"left": `${pos.left - (swidth/(200)) * speed}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 70px 20px #103243`});

        $(this).find(".housedoor").css({"box-shadow": `${((pos.left / swidth) - 0.5) * 30}px 5px 10px #000000aa`})
        $(this).find(".housemain").css({"box-shadow": `${((pos.left / swidth) - 0.5) * 30}px 0px 30px #000000`})
    });
    }, 17);

    // Move Trees
window.setInterval(function(){
    if (!document.hasFocus()) {
        return
    }
    

    $('.treetrunk').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove(); 
        }

        $(this).css({"left": `${pos.left - (swidth/(400)) * speed}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 10px 20px #000000aa`});
    });

    $('.leaf').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove(); 
        }

        $(this).css({"left": `${pos.left - (swidth/(400)) * speed}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 10px 20px #000000aa`});
    });
    }, 17);



  window.setInterval(function() {
    if (document.hasFocus()) {
        //Speeds up the player
        speed += 0.01;
    }
  }, 1000);


    //Spawning and Scoring Logic

    setTimeout(move, 800 / speed)

    function move() {
        if (!document.hasFocus()) {
            setTimeout(move, 5000 / speed)
            return
        }
        
        //Increase Score
        distance++;
        $('#distval').html(distance);

        //Generate Cloud
        if (distance % 13 == 0 && $('.cloudpiece').length < 14) {
            generateCloud(swidth);
        }

        //Generate House
        if (distance % 2 == 1 && $(".house").length < 4) {
            generateHouse(swidth);
        }

        //Generate Tree
        if (distance % 2 == 0 && $(".treetrunk").length < 5) {
            generateTree(swidth + 100);
        }

        setTimeout(move, 800 / speed)
    }

  $(document).ready(function () {
    setup();
    $(window).resize(function() {
        setup();
    });
});


// Player movement

$(document).on('mousemove', function(e){
    curX = e.pageX - 55;
    curY = e.pageY - 22;
});

window.setInterval(function(){
    if (!document.hasFocus()) {
        return
    }

    // Get difference beteween the character's position and the mouse
    diffX = curX - playerX;
    diffY = curY - playerY;

    // Get the speed of the character for this step
    spdX = (diffX / 8);
    spdY = (diffY / 8);

    // Get the new player Position
    playerX += clamp(diffX, -spdX, spdX);
    playerY += clamp(diffY, -spdY, spdY);

    rotation = (spdX / 1.5) + (spdY / 1.5);

    // Move the Player
    $('#player').css(
        {"top": `${playerY}px`,  // Vertical Position
         "left": ` ${playerX}px`, // Horizontal position
         "transform": `rotate(${clamp(rotation, -50, 50)}deg)`, // Rotation
        });
    
    $('#iris').css({"top": `${5 + (clamp(spdY, -2, 2))}px`, "left": `${5 + (clamp(spdX, -2, 2))}px`})

        // Use a box shadow to show where the player is (I spent way too much time on this considering it is purely cosmetic but it might be worth it idk it was pain but it looks cool now?????????????????????????????????????)
    $("#armL, #armR, #legL, #legR, #body, #player").css({"box-shadow": `${diffX - spdX * 2}px ${diffY - trigIsUsefulNow(rotation, diffX)}px ${((Math.abs(spdX) + Math.abs(spdY))) + 5}px #ffffffa5`})

  }, 17);

// FUNCTIONS
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function setup() {
    sheight = window.innerHeight;
    swidth = window.innerWidth;

    if (!init) {
        generateCloud(swidth * 0.33);
        generateCloud(swidth * 0.66);
        generateCloud(swidth);
        init = true;
    }
}

function generateHouse(x) {
    $("#housecontainer").append(`
    <div class="house" style="left: ${x}px;">
        <div class="houseroof" style="border-bottom: 150px solid #${randomHouseColor()};"></div>
        <div class="housemain" style="background-color: #${randomHouseColor()};"></div>
        <div class="housedoor" style="background-color: #${randomHouseColor()};"></div>
    </div>
`)
}

function generateCloud(x) {
    //Amount of circles to make up the cloud (3-6)
    circles = 3 + Math.floor(Math.random() * 4)

    for (let i = 0; i < circles; i++) {
        let cur = (Math.random() * 65) + 30;
        let height = (180 - (cur / 2));
        width = (height - 15) + (Math.random() * 30);
        x += cur;
        $("#cloudcontainer").append(`<div class="cloudpiece" style="left: ${x}px; top: ${Math.random() * 100}px; width: ${width}px; height: ${height}px"></div>`);
    }
}

function generateTree(x) {
    height = 250 + (Math.random() * 200);

    $("#treecontainer").append(`<div class="treetrunk" style="height: ${height}px; left: ${x}px"></div>`);

    generateLeaf(x + 30, height + -80)
    generateLeaf(x - 60, height + -80)
    generateLeaf(x, height + 5);
    generateLeaf(x + 15, height + -40)
    generateLeaf(x - 35, height + -40)

}

function generateLeaf(x, y) {
    x += (Math.random() * 20) - 40
    y += (Math.random() * 20) - 40
    
    $("#treecontainer").append(`<div class="leaf" style="bottom: ${y}px; left: ${x}px"></div>`);
}

function randomHouseColor() {    
    s = (Math.random());

    r = (Math.floor(130 * s)).toString(16);
    g = (Math.floor(45 * s)).toString(16);

    if (r.length < 2) {
        r = "0" + r;
    }

    if (g.length < 2) {
        g = "0" + g;
    }
    return `${r.toString(16)}${g}00`;
}

function trigIsUsefulNow(deg, adjacent) {
    return Math.tan(deg * Math.PI / 180) * adjacent;
}