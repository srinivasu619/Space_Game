var context;
var PlayerBullets = [];
var Enemies = [];
var score = 0;
var shieldStrength = 3;
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
// return key name
function collides(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function handleCollisions() {
    PlayerBullets.forEach(function (bullet) {
        Enemies.forEach(function (enemy) {
            if (collides(enemy, bullet)) {
                enemy.explode();
                bullet.active = false;
                score += 10;
                console.log(score);
            }
        })
    });
    Enemies.forEach(function (enemy) {
        if (collides(enemy, player)) {
            enemy.explode();
            player.explode();
        }
    });
    Enemies.forEach(function (enemy) {
        if (enemy.y + enemy.height >= 250) {
            enemy.explode();
            shieldStrength = shieldStrength - 1;
            if (shieldStrength == 2)
                player.explode();
        }
    });
}
var keyName = function (event) {
    return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
}
// key binding function
var initialize = function () {
    window.keydown = {};
    $(document).bind("keydown", function (event) {
        keydown[keyName(event)] = true;
    });
    $(document).bind("keyup", function (event) {
        keydown[keyName(event)] = false;
    });
}
var shield = {
    draw: function () {
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.moveTo(0, 250);
        context.lineTo(480, 250);
        context.stroke();
    }
}
var player = {
    color: "#00A",
    x: 220,
    y: 270,
    width: 32,
    height: 32,
    sprite: Sprite("jet"),
    draw: function () {
        this.sprite.draw(context, this.x, this.y);
    },
    midpoint: function () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    },
    shoot: function () {
        var bulletPos = this.midpoint();
        PlayerBullets.push(bullet({
            speed: 5,
            x: bulletPos.x,
            y: bulletPos.y
        }));
    },
    explode: function () {
        stopFunction(window.interval_id);
    }
}
var stopFunction = function (id) {
    console.log("game loop stopped");
    clearInterval(id);
}
var draw = function () {
    player.draw();
    shield.draw();
    PlayerBullets.forEach(function (b) {
        b.draw();
    });
    Enemies.forEach(enemy => {
        enemy.draw();
    });
}
var update = function () {
    if (keydown.left) {
        player.x -= 5;
        //console.log("MOVE LEFT");
    }
    if (keydown.right) {
        player.x += 5;
        //console.log("MOVE LEFT");
    }
    if (keydown.space) {
        player.shoot();
    }
    player.x = player.x.clamp(0, 480 - player.width);
    handleCollisions();
    PlayerBullets.forEach((b) => {
        b.update();
    });
    PlayerBullets = PlayerBullets.filter((b) => {
        return b.active;
    });
    Enemies.forEach((e) => {
        e.update();
    });
    Enemies = Enemies.filter((e) => {
        return e.active;
    });
    if (Math.random() < 0.015) {
        Enemies.push(Enemy());
    }
}
//Constructor fo creating the bullet
function bullet(I) {
    I.active = true;
    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 3;
    I.height = 3;
    I.color = "#fff";

    // checking bounds of the bullet
    I.inBounds = function () {
        return I.x >= 0 && I.x <= 480 && I.y >= 0 && I.y <= 320;
    }

    // draw function for the bullet
    I.draw = function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;
        I.active = I.active && I.inBounds();
    }
    return I;
}

function Enemy(I) {
    I = I || {};
    I.active = true;
    I.x = 480 / 4 + Math.random() * (200);
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = 2;
    I.width = 32;
    I.height = 32;
    I.color = "#A2B";
    I.age = Math.floor(Math.random() * 128);
    I.sprite = Sprite("ufo");
    I.draw = function () {
        this.sprite.draw(context, this.x, this.y);
    }
    I.inBounds = function () {
        return I.x >= 0 && I.x <= 480 && I.y >= 0 && I.y <= 320;
    }
    I.explode = function () {
        this.active = false;
    }
    I.update = function () {
        I.x += I.xVelocity;
        I.y += 0.1;
        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
        I.age++;
        I.active = I.active && I.inBounds();
    }
    return I;
}
$(document).ready(function () {
    console.log("ready!");
    initialize();
    var canvas = document.getElementById("play");
    context = canvas.getContext("2d");
    var intervalId = setInterval(function () {
        context.clearRect(0, 0, 480, 320);
        context.fillStyle = "#000";
        context.fillRect(0, 0, 480, 320);
        update();
        draw();
    }, 1000 / 25);
    window.interval_id = intervalId;
    console.log(intervalId);
});