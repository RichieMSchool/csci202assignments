performanceDroppingIntervals = [];

sheight = 1080;
swidth = 1920;
init = false;

speed = 1;
distance = 1;

playerX = 0;
playerY = 0;

curX = 0;
curY = 0;

lagSpd = 30;
lives = 3;

isDay = true;


// MOVING BACKGROUNDS

const cloudshadowday = "#103243";
const cloudshadownight = "#000000";
curcloudshadow = cloudshadowday;

// Move Clouds
cloudInterval = window.setInterval(function () {
    if (!document.hasFocus()) {
        return
    }

    $('.cloudpiece').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }
        $(this).css({ "left": `${pos.left - ((swidth / (800 + (Math.random() * 800 / speed))) * speed)}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 20px 20px ${curcloudshadow}` });
    });

}, 17);


// Move Houses
houseInterval = window.setInterval(function () {
    if (!document.hasFocus()) {
        return
    }

    $('.house').each(function () {
        pos = $(this).position();

        if (pos.left + 200 <= 0) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left - (swidth / (200)) * speed}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 70px 20px #103243` });

        $(this).find(".housedoor").css({ "box-shadow": `${((pos.left / swidth) - 0.5) * 30}px 5px 10px #000000aa` })
        $(this).find(".housemain").css({ "box-shadow": `${((pos.left / swidth) - 0.5) * 30}px 0px 30px #000000` })
    });
}, 17);

// Move Trees
treeInterval = window.setInterval(function () {
    if (!document.hasFocus()) {
        return
    }


    $('.treetrunk').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left - (swidth / (400)) * speed}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 10px 20px #000000aa` });
    });

    $('.leaf').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left - (swidth / (400)) * speed}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 10px 20px #000000aa` });
    });
}, 17);


// clearInterval(houseInterval);
// clearInterval(cloudInterval);
// clearInterval(treeInterval);


//MOVING OBSTACLES

//Moving Walls

window.setInterval(function () {
    if (!document.hasFocus()) {
        return
    }

    $('.wall').each(function () {
        
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        if (is_colliding($(this), $("#player"))) {
            this.remove();
            hurtPlayer();
        }

        $(this).css({ "left": `${pos.left - ((swidth/400) * speed)}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 20}px 5px 5px black` });
    });

}, 17);


//MOVING POWERUPS

SPDirCnt = 0;
SPDir = 1;


window.setInterval(function () {

    if (!document.hasFocus()) {
        return
    }

    SPDirCnt += 0.07;

    SPDir = Math.sin(SPDirCnt) * 8;


    $('.power').each(function () {
        
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        if (is_colliding($(this), $("#player")) || is_colliding($(this), $("#armL") || is_colliding($(this), $("#legL") || is_colliding($(this), $("#body") )))) {
            

            if ($(this).hasClass("speeditem")) {
                if(lagSpd > 1) {
                    lagSpd--;
                    $("#speedval").html(30 - lagSpd + 1);
                } else {
                    lagSpd = 1; //I don't think this is needed but im very tired and I don't feel like thinking though it
                }

            } else if ($(this).hasClass("lifeitem")) {
                lives++;
                $("#lifeval").html(lives);
            }

            $(this.remove());
        }

        $(this).css({ "left": `${pos.left - ((swidth/600) * speed)}px`, "top": `${pos.top + SPDir}px`});
    });

}, 17);





// Speed changes

var speedInterval = window.setInterval(function () {
    if (document.hasFocus()) {
        if (speed >= 6.5) {
            speed = 6.5;
            clearInterval(speedInterval)
        }
        //Speeds up the player
        speed += 0.01;
    }
}, 1000);


//Spawning and Scoring Logic

setTimeout(move, 800 / speed)

dayShift = 100;

function move() {
    if (!document.hasFocus()) {
        setTimeout(move, 800 / speed)
        return
    }


    //Change DayTime
    if (distance % dayShift == 0) {
        isDay = !isDay;

        if(!isDay) {
            $('body').addClass("night");
            $("#bgoverlay").addClass("night");
            $(".treetrunk").addClass("night");
            $(".leaf").addClass("night");

            $(".cloudpiece").addClass("night");
            curcloudshadow = cloudshadownight;

            $(".housemain").css({"background-color": `#${randomHouseColor()}`});
            $(".housedoor").css({"background-color": `#${randomHouseColor()}`});
            $(".houseroof").css({"border-bottom": `150px solid #${randomHouseColor()}`});

            $("#speed").addClass("night");
            $("#lives").addClass("night");
            $("#distance").addClass("night");

        } else {
            $("body").removeClass("night");
            $("#bgoverlay").removeClass("night");
            $(".treetrunk").removeClass("night");
            $(".leaf").removeClass("night");
            curcloudshadow = cloudshadownight;
            $(".cloudpiece").removeClass("night");
            $(".housemain").css({"background-color": `#${randomHouseColor()}`});
            $(".housedoor").css({"background-color": `#${randomHouseColor()}`});
            $(".houseroof").css({"border-bottom": `150px solid #${randomHouseColor()}`});

            $("#speed").removeClass("night");
            $("#lives").removeClass("night");
            $("#distance").removeClass("night");
        }

        dayShift += Math.floor(100 * speed);
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

    //Spawn PowerUp
    if (distPower <= distance) {
        spawnRandomPower();
        distPower = distance + newPowerSpawnTime();
    }

    //Spawn Obstacle
    if (distObstacle <= distance) {
        SpawnRandomObstacle();
        distObstacle = distance + newObstacleSpawnTime();
    }

    setTimeout(move, 800 / speed)
}

$(document).ready(function () {
    setup();
    $(window).resize(function () {
        setup();
    });
});


// Player movement

$(document).on('mousemove', function (e) {
    curX = clamp(e.pageX - 55, 0, swidth);
    curY = clamp(e.pageY - 22, 0, sheight - 30);
});

window.setInterval(function () {
    if (!document.hasFocus()) {
        return
    }

    // Get difference beteween the character's position and the mouse
    diffX = curX - playerX;
    diffY = curY - playerY;

    // Get the speed of the character for this step
    spdX = (diffX / lagSpd);
    spdY = (diffY / lagSpd);

    // Get the new player Position
    playerX += clamp(diffX, -spdX, spdX);
    playerY += clamp(diffY, -spdY, spdY);

    rotation = (spdX / 1.5) + (spdY / 1.5);

    // Move the Player
    $('#player').css(
        {
            "top": `${playerY}px`,  // Vertical Position
            "left": ` ${playerX}px`, // Horizontal position
            "transform": `rotate(${clamp(rotation, -50, 50)}deg)`, // Rotation
        });

    // Make the eyes follow the cursor
    $('#iris').css({ "top": `${5 + (clamp(spdY, -2, 2))}px`, "left": `${5 + (clamp(spdX, -2, 2))}px` });

    // Use a box shadow to show where the player is (I spent way too much time on this considering it is purely cosmetic but it might be worth it idk it was pain but it looks cool now?????????????????????????????????????)
    $("#armL, #armR, #legL, #legR, #body, #player").css({ "box-shadow": `${diffX - spdX * 2}px ${diffY - findTanOpposite(rotation, diffX)}px ${((Math.abs(spdX) + Math.abs(spdY))) + 5}px #ffffffa5` })

}, 17);

// FUNCTIONS
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function setup() {

    if (window.innerHeight < sheight || window.innerWidth < swidth) {
        $("#reswarning").css({ "opacity": 1 });
    } else {
        $("#reswarning").css({ "opacity": 0 });
    }

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
        $("#cloudcontainer").append(`<div class="cloudpiece ${isDay ? "": "night"}" style="left: ${x}px; top: ${Math.random() * 100}px; width: ${width}px; height: ${height}px"></div>`);
    }
}

function generateTree(x) {
    height = 250 + (Math.random() * 200);

    $("#treecontainer").append(`<div class="treetrunk ${isDay ? "": "night"}" style="height: ${height}px; left: ${x}px"></div>`);

    generateLeaf(x + 30, height + -80)
    generateLeaf(x - 60, height + -80)
    generateLeaf(x, height + 5);
    generateLeaf(x + 15, height + -40)
    generateLeaf(x - 35, height + -40)

}

function generateLeaf(x, y) {
    x += (Math.random() * 20) - 40
    y += (Math.random() * 20) - 40

    $("#treecontainer").append(`<div class="leaf ${isDay ? "": "night"}" style="bottom: ${y}px; left: ${x}px"></div>`);
}

function randomHouseColor() {

    s = (Math.random());

    if(!isDay) {
        s = (s/4);
    } else {
        s = (1 - (s/2));
    }

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

function findTanOpposite(deg, adjacent) {
    return Math.tan(deg * Math.PI / 180) * adjacent;
}

function hurtPlayer() {
    $("#hurtoverlay").addClass('hurt')
    .on("animationend", function(){
    $(this).removeClass('hurt');
  });

  lives--;
  $("#lifeval").html(lives);

  $("#obstaclecontainer").empty();


  //Player dies
  if (lives == 0) {
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

    $("#endscreen").html(`<h1>GAME OVER</h1><h2>Score:<span>${distance}</span></h2><h3><a href="./final.html">Click Here to Restart<a></h3>`)

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }

  }
}

// POWERS AND OBSTACLE FUNCTIONS

powerFuncs = [spawnSpeedUp, spawnLifeUp]
obstacleFuncs = [spawnWall]

distObstacle = newObstacleSpawnTime();
distPower = newPowerSpawnTime();

function SpawnRandomObstacle() {
    
    obstacleFuncs[Math.floor(Math.random() * 1)]();
}

function spawnWall() {

    // Choose if wall is doubled, comes from the top, or the bottom
    let rand = Math.random();
    if (rand < .2) {
        // From top
        offset = -10 - (Math.random() * 500);
    }
    else if (rand < .4){
        // From Bottom
        offset = (sheight - 690) + (Math.random() * 500);
    }
    else {

        gap = 200 + (Math.random() * 300);
        offset = -10 - (Math.random() * 500);
        $("#obstaclecontainer").append(`<div class="wall" style = "top: ${offset + gap + 700}px; left: ${swidth}px;"></div>`);
    }

    $("#obstaclecontainer").append(`<div class="wall" style = "top: ${offset}px; left: ${swidth}px;"></div>`);
}

function newObstacleSpawnTime() {
    return Math.floor((Math.random() * 6) + 12);
}

function newPowerSpawnTime() {
    return Math.floor((Math.random() * 100) + 100);
}

function spawnRandomPower() {
    if (lagSpd == 1) {
        spawnLifeUp((Math.random() * sheight/2) + (sheight / 4));
    }

    powerFuncs[Math.floor(Math.random() * 2)](swidth, (Math.random() * sheight/2) + (sheight / 4));
}

function spawnSpeedUp(x, y) {
    $("#obstaclecontainer").append(`<div class="speeditem power" style = "left: ${x}px; top: ${y}px">
    <div class="speedVisA" style="top:13px">
        <div class="speedVisAL"></div>
        <div class="speedVisAR"></div>
    </div>
    <div class="speedVisA" style="top:29px">
        <div class="speedVisAL"></div>
        <div class="speedVisAR"></div>
    </div>
</div>`);
}

function spawnLifeUp(x, y) {
    $("#obstaclecontainer").append(`<div class="lifeitem power" style = "left: ${x}px; top: ${y}px">
    <div class="lifeVisPlus"> +</div>
</div>`);
}
