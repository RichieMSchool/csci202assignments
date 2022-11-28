parseURL();

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

intervalTime = 17;
spdMult = 1;
bgSpdMult = 1;

hpercent = 0;
wpercent = 0;
curZoom = 1;

cursorMult = 1;

const cloudshadowday = "#103243";
const cloudshadownight = "#000000";
curcloudshadow = cloudshadowday;

laserTimeouts = new Set();

playerInterval = -1;
cloudInterval = -1;
houseInterval = -1;
treeInterval = -1;
shipInterval = -1;
wallInterval = -1;
fireworkInterval= -1;
laserColInterval = -1;
powerupInterval = -1;

// Remember player's FPS preference

if (window.location.href.split("#")[1] !== undefined) {
    changeFPS(window.location.href.split("#")[1]);
} else {
    if(window.location.href.split('?fps=')[1] === undefined) { // The only reason this if statement exists is because of a race condition where this code runs before the URL can be changed
        changeFPS("60fps");
    }
}

clearTimeIntervals()

window.onblur = function () {
    $(".laserBase").css({"animation-play-state": "paused"});
}

window.onfocus = function () {
    $(".laserBase").css({"animation-play-state": "running"});
}

//Spawning and Scoring Logic

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

    //Spawn ClearAll
    if (Math.random() < 0.002) {
        spawnClearAll(swidth, (Math.random() * sheight/2) + (sheight / 4));
    }

    //Spawn Horizontal Obstacle
    if (distObstacle <= distance) {
        SpawnRandomObstacle();
        distObstacle = distance + newObstacleSpawnTime();
    }

    //Spawn Ship
    if (distship <= distance) {
        spawnShip();
        distship = distance + newObstacleSpawnTime();
    }

    //Spawn Firework 

    if (distFirework <= distance) {
        spawnFirework();
        distFirework = distance + newObstacleSpawnTime();
    }

    setTimeout(move, 800 / speed)
}

$(document).ready(function () {
    setup();
    $(window).resize(function () {

        setup();
    });
});


// Track Cursor
$(document).on('mousemove', function (e) {
    curX = clamp((e.pageX * cursorMult) - 55, 0, swidth);
    curY = clamp((e.pageY * cursorMult) - 22, 0, sheight - 30);
});

// FUNCTIONS

// Debug Functions

function showCollider() {
    $("#betweencol").css({"opacity": 1})
    $("#prevpos").css({"opacity": 1})
    $("#poweruphitbox").css({"border": "5px solid greenyellow"});
}

function hideCollider() {
    $("#betweencol").css({"opacity": 0})
    $("#prevpos").css({"opacity": 0})
    $("#poweruphitbox").css({"border": "5px solid transparent"});
}


function parseURL(){
    let param = window.location.href.split('?fps=')[1];
    if (param === undefined) {
        return;
    }

    url = window.location.href.split('html');

    window.location.href = url[0] + 'html#' + param;

}

function changeFPS(option) {
    clearTimeIntervals();

    let url = window.location.href.split('html');

    switch(option) {
        case "15fps":
            intervalTime = 67;
            spdMult = 4;
            window.location.href = url[0] + 'html' + "#15fps";
            break;
        case "30fps":
            intervalTime = 33;
            spdMult = 2;
            window.location.href = url[0] + 'html' + "#30fps";
            break;
        case "60fps":
             default:
            intervalTime = 17;
            spdMult = 1;
            window.location.href = url[0] + 'html' + "#60fps";
            break;
    }

    createTimeIntervals();
}

function changeBGFPS(multiplier) {
    clearTimeIntervals();

    //Current multiplier

    switch(bgSpdMult) {
        case 1:
            $("#bgfull").removeClass("selected");
            break;
        case 2:
            $("#bghalf").removeClass("selected");
            break;

        case 4:
            $("#bgquarter").removeClass("selected");
            break;
    }

    switch(multiplier) {
        case "bgfull":
            bgSpdMult = 1;
            $("#bgfull").addClass("selected");
            break;
        case "bghalf":
            bgSpdMult = 2;
            $("#bghalf").addClass("selected");
            break;
        case "bgquarter":
        default:
            bgSpdMult = 4;
            $("#bgquarter").addClass("selected");
            break;
    }

    createTimeIntervals();
}

function createTimeIntervals() {

    if (intervalTime == 0) {
        //pause
        return;
    }

    playerInterval = window.setInterval(movePlayer, intervalTime);
    
    cloudInterval = window.setInterval(moveClouds, intervalTime * bgSpdMult);
    houseInterval = window.setInterval(moveHouses, intervalTime * bgSpdMult);
    treeInterval = window.setInterval(moveTrees, intervalTime * bgSpdMult);

    wallInterval = window.setInterval(moveWalls, intervalTime);
    shipInterval = window.setInterval(moveShips, intervalTime);
    fireworkInterval = window.setInterval(moveFireworks, intervalTime);

    laserColInterval = window.setInterval(checkLaserCollision, intervalTime);

    powerupInterval = window.setInterval(movePowerups, intervalTime);
}

function clearTimeIntervals() {
    clearInterval(playerInterval);

    clearInterval(cloudInterval);
    clearInterval(houseInterval);
    clearInterval(treeInterval);

    clearInterval(wallInterval);
    clearInterval(shipInterval);
    clearInterval(fireworkInterval);

    clearInterval(laserColInterval);

    clearInterval(powerupInterval);
}

// Moving functions

// Moving player
function movePlayer() {
    if (!document.hasFocus()) {
        return
    }
    
    let prevX = playerX + 25;
    let prevY = playerY + 25;

    // Get difference beteween the character's position and the mouse
    diffX = curX - playerX;
    diffY = curY - playerY;

    // Get the speed of the character for this step
    spdX = (diffX / lagSpd);
    spdY = (diffY / lagSpd);

    // Get the new player Position
    playerX += clamp(diffX, -spdX, spdX) * spdMult;
    playerY += clamp(diffY, -spdY, spdY) * spdMult;

    rotation = (spdX / 1.5) + (spdY / 1.5);

    // Move the Player
    $('#player').css(
        {
            "top": `${playerY}px`,  // Vertical Position
            "left": ` ${playerX}px`, // Horizontal position
            "transform": `rotate(${clamp(rotation, -50, 50)}deg)`, // Rotation
        });

    // Adjust the collision detector
    
    $("#betweencol").css(
        {
            "top": `${prevY}px`,  // Vertical Position
            "left": ` ${[prevX]}px`, // Horizontal position
            "transform": `rotate(${(Math.atan2(prevX - (playerX + 25), (playerY + 25) - prevY))}rad)`, // Points to player
            "height": `${getVectorMagnitude(playerX + 25, prevX, prevY, playerY + 25)}px`
            
        });

    $("#prevpos").css(
        {
            "top": `${prevY - 10}px`,  // Vertical Position
            "left": ` ${[prevX - 10 ]}px`, // Horizontal position
        }
    );

    // Make the eyes follow the cursor
    $('#iris').css({ "top": `${5 + (clamp(spdY, -2, 2))}px`, "left": `${5 + (clamp(spdX, -2, 2))}px` });

    // Use a box shadow to show where the player is (I spent way too much time on this considering it is purely cosmetic but it might be worth it idk it was pain but it looks cool now?????????????????????????????????????)
    $("#armL, #armR, #legL, #legR, #body, #player").css({ "box-shadow": `${diffX - spdX * 2}px ${diffY - findTanOpposite(rotation, diffX)}px ${((Math.abs(spdX) + Math.abs(spdY))) + 5}px #ffffffa5` })

}


// Moving background

function moveClouds() {
    if (!document.hasFocus()) {
        return
    }

    $('.cloudpiece').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }
        $(this).css({ "left": `${pos.left - ((swidth / (800 + (Math.random() * 800 / speed))) * speed * spdMult * bgSpdMult)}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 20px 20px ${curcloudshadow}` });
    });
}

function moveHouses() {
    if (!document.hasFocus()) {
        return
    }

    $('.house').each(function () {
        pos = $(this).position();

        if (pos.left + 200 <= 0) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left - (swidth / (200)) * speed * spdMult * bgSpdMult}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 70px 20px #103243` });

        $(this).find(".housedoor").css({ "box-shadow": `${((pos.left / swidth) - 0.5) * 30}px 5px 10px #000000aa` })
        $(this).find(".housemain").css({ "box-shadow": `${((pos.left / swidth) - 0.5) * 30}px 0px 30px #000000` })
    });
}

function moveTrees() {
    if (!document.hasFocus()) {
        return
    }


    $('.treetrunk').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left - (swidth / (400)) * speed * spdMult * bgSpdMult}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 10px 20px #000000aa` });
    });

    $('.leaf').each(function () {
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left - (swidth / (400)) * speed * spdMult * bgSpdMult}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 70}px 10px 20px #000000aa` });
    });
}

// Moving Obstacles

function moveWalls() {
    if (!document.hasFocus()) {
        return
    }

    $('.wall').each(function () {
        
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        if (is_colliding($(this), $("#betweencol"))) {
            this.remove();
            hurtPlayer();
        }

        $(this).css({ "left": `${pos.left - ((swidth/500) * speed * spdMult)}px`, "box-shadow": `${((pos.left / swidth) - 0.5) * 20}px 5px 5px black` });
    });
}

function moveFireworks() {
    if (!document.hasFocus()) {
        return
    }

    $('.firework').each(function () {


        pos = $(this).position();

        if (pos.top >= sheight) {
            $(this).remove();
        }

        $(this).css({ "top": `${pos.top + ((sheight/300) * speed * spdMult)}px`});
        
        if (is_colliding($(this), $("#betweencol"))) {
            this.remove();
            hurtPlayer();
        }
    });

    $('.fireworksil').each(function () {
        pos = $(this).position();

        if (pos.top <= -300) {
            $(this).removeClass("fireworksil");
            $(this).addClass("firework");
        }

        $(this).css({ "top": `${pos.top - ((sheight/400) * speed * spdMult)}px`});
    })
}


laserSize = 0;
function moveShips() {
    if (!document.hasFocus()) {
        return
    }

    $('.ship').each(function () {
        pos = $(this).position();

        if (pos.left >= swidth) {
            $(this).remove();
        }

        $(this).css({ "left": `${pos.left + ((swidth/1200) * speed * spdMult)}px`});
        
        if (is_colliding($(this), $("#betweencol"))) {
            this.remove();
            hurtPlayer();
        }
    });

    laserSize += 0.02 * speed * spdMult;

    $('.laser').each(function () {
        $(this).css({ "height": `${Math.sin(laserSize) * 1060 + 10}px`});

        if (is_colliding($(this), $("#betweencol"))) {
            this.remove();
            hurtPlayer();
        }
    })
}

// not acutally moving but this checks collisions
function checkLaserCollision() {
    $('.horizontalLaser').each(function () {
        if (is_colliding($(this), $("#betweencol"))) {
            this.remove();
            hurtPlayer();
        }
    })
}

// Moving powerups
SPDirCnt = 0;
SPDir = 1;

function movePowerups() {
    if (!document.hasFocus()) {
        return
    }

    SPDirCnt += 0.07 * spdMult;

    SPDir = Math.sin(SPDirCnt) * 8;


    $('.power').each(function () {
        
        pos = $(this).position();

        if (pos.left + $(this).width() <= 0) {
            $(this).remove();
        }

        if (is_colliding($(this), $("#betweencol")) || is_colliding($(this), $("#poweruphitbox"))) {
            

            if ($(this).hasClass("speeditem")) {
                if(lagSpd > 5) {
                    lagSpd--;
                    $("#speedval").html(30 - lagSpd + 1);
                } else {
                    lagSpd = 5; //I don't think this is needed but im very tired and I don't feel like thinking though it
                    $("#speedval").html(30 - lagSpd + 1);
                }

                triggerEffectAnim('speedup')

            } else if ($(this).hasClass("lifeitem")) {
                lives++;
                $("#lifeval").html(lives);
                triggerEffectAnim('heal');
            } else if ($(this).hasClass("removeall")) {
                triggerEffectAnim("clearAll")
                // "Skips" next obstacle
                distObstacle += newObstacleSpawnTime() + newObstacleSpawnTime() + (newObstacleSpawnTime() / 2);
                distship += newObstacleSpawnTime() + newObstacleSpawnTime() + (newObstacleSpawnTime() / 2);
                distFirework += newObstacleSpawnTime() + newObstacleSpawnTime() + (newObstacleSpawnTime() / 2);
                clearLaserTimeouts();
                $("#obstaclecontainer").empty();
            }

            $(this.remove());
        }

        $(this).css({ "left": `${pos.left - ((swidth/600) * speed * spdMult)}px`, "top": `${pos.top + SPDir}px`});
    });
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function setup() {
    
    hpercent = window.innerWidth/swidth
    wpercent = window.innerHeight/sheight
    curZoom = 1;

    if ('zoom' in document.body.style) {
        if (wpercent < hpercent) {
            document.body.style.zoom = `${wpercent* 100}%`
            curZoom = wpercent;
        }
        else {
            document.body.style.zoom = `${hpercent* 100}%`
            curZoom = hpercent;
        }
        cursorMult = 1 / curZoom;
    }
    else {
        if (window.innerHeight < sheight || window.innerWidth < swidth) {
            $("#reswarning").css({ "opacity": 1 });
        } else {
            $("#reswarning").css({ "opacity": 0 });
        }
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

function getVectorMagnitude(x1, x2, y1, y2) {
    // Just the Distance formula
    return Math.sqrt(square(x2 - x1) + square(y2 - y1));
}

function square(x) {
    return x * x;
}

function hurtPlayer() {
  triggerEffectAnim('hurt')

  lives--;
  $("#lifeval").html(lives);

  $("#obstaclecontainer").empty();


  //Player dies
  if (lives == 0) {
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

    
    $("#endscreen").html(`<h1>GAME OVER</h1><h2>Score: <span>${distance}</span></h2><h3><a href="./final.html?fps=${window.location.href.split('#')[1]}">Click Here to Restart<a></h3>`)

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }

  }
}

// POWERS AND OBSTACLE FUNCTIONS

powerFuncs = [spawnSpeedUp, spawnLifeUp]
obstacleFuncs = [spawnWall, spawnLasers]


distObstacle = 5;
distship = 12;
distFirework = 3;
distPower = 50;

function SpawnRandomObstacle() {
    
    obstacleFuncs[Math.floor(Math.random() * 2)]();
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

function spawnLasers () {
    let amount = Math.floor(Math.random() * 6) + 3
    let largestTime = 0;
    let timeoutIDS = [];

    for (let i = 0; i < amount; i++) {
        cur = Math.random() * (2000 / speed);

        if(cur >= largestTime) {
            largestTime = cur;
        }

        let curID = setTimeout(spawnLaser, cur);
        laserTimeouts.add(curID);
        timeoutIDS.push(curID);
    }
    setTimeout(removeLaserTimeoutIDs, largestTime + 500, timeoutIDS); // workaround to remove non active laser timeouts
}

function removeLaserTimeoutIDs(timeoutIDS) {
        timeoutIDS.forEach(function (e) {
            laserTimeouts.delete(e);
        })
}

function clearLaserTimeouts() {
    laserTimeouts.forEach(function (e) {
        clearTimeout(e);
        laserTimeouts.delete(e);
    })
}

function spawnLaser() {
    let spawned = false;
    let h = Math.random() * (sheight - 60);

    let p = document.createElement("div");
    let $pvw = $(p).addClass("horizontalLaserPrev").css({
        "top": `${h - 25}px`
    })

    $("#obstaclecontainer").append($pvw);

    // This is a nightmare
    let l = document.createElement("div")
    let $left = $(l).addClass("laserBase").css({
        "animation-name": "laserLShow",
        "top": `${h}px`,
        "animation-duration": `${6.5 / speed}s`
    })

    let las = document.createElement("div");
    let $laser = $(las).addClass("horizontalLaser").css({
        "top": `${h + 38}px`
    })

    let r = document.createElement("div")

    //The right side's animation triggers the laser (no particular reason for choosing the right side)
    let $right = $(r).addClass("laserBase").css({
        "animation-name": "laserRShow",
        "left": "1860px",
        "top": `${h}px`,
        "animation-duration": `${6.5 / speed}s`
    }).on("animationend", function () {
        if (!spawned) {
            spawned = true;

            $pvw.remove();
            $("#obstaclecontainer").append($laser)
            setTimeout(function () {
                $laser.remove();
                $right.css({ "animation-name": "laserRLeave" })
                $left.css({ "animation-name": "laserLLeave" }).on("animationend", function () {
                    $left.remove();
                    $right.remove();
                });
            }, 3000 / speed);
        }
    });

    $("#obstaclecontainer").append($left)
    $("#obstaclecontainer").append($right)
}

function spawnFirework() {
    let classname = isDay ? "fireworksil" : "fireworksil night"

    $("#obstaclecontainer").append(`<div class="${classname}" style = "top: ${sheight + 200}px; left: ${100 + ((Math.random() * (swidth - 100)))}px;"><div class="fireworktop"></div></div>`);
}

function spawnShip() {
    $("#obstaclecontainer").append(`<div class="ship" style="top: 0; left: -165px;"><div class="laser"></div><div class="shipbody"></div></div>`)
}

function newObstacleSpawnTime() {
    return Math.floor((Math.random() * 10) + 12);
}

function newPowerSpawnTime() {
    return Math.floor((Math.random() * 100) + 50);
}

function spawnRandomPower() {
    if (lagSpd <= 5) {
        spawnLifeUp(swidth, (Math.random() * sheight/2) + (sheight / 4));
        return;
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

function spawnClearAll(x, y) {
    $("#obstaclecontainer").append(`<div class="removeall power" style = "left: ${x}px; top: ${y}px"></div>`)
}

function triggerEffectAnim(classname) {
    $("#effectoverlay").addClass(classname)
    .on("animationend", function(){
    $(this).removeClass(classname);
  });
}

function startGame() {
    $("#howtoplay").remove();

    // Speed changes
    var speedInterval = window.setInterval(function () {
        if (document.hasFocus()) {
            if (speed >= 9) {
                speed = 9;
                clearInterval(speedInterval)
            }
            //Speeds up the player
            speed += 0.01;
        }
    }, 1000);

    // Start Movement Loop
    setTimeout(move, 800 / speed)

    createTimeIntervals();
}
