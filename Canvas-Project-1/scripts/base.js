var context;
var PlayerBullets = [];
var Enemies = [];
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
// return key name
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
var player = {
    color: "#00A",
    x: 220,
    y: 270,
    width: 32,
    height: 32,
    sprite: Sprite("player"),
    draw: function () {
        this.sprite.draw(context,this.x,this.y);
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
    }
}
var stopFunction = function (id) {
    clearInterval(id);
}
var draw = function () {
    player.draw();
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
    if(Math.random() < 0.015)
    {
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
    I.color = "#000";

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
    I.x = 480 / 4 + Math.random() * (300);
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = 2;
    I.width = 32;
    I.height = 32;
    I.color = "#A2B";
    I.sprite = Sprite("enemy");
    I.draw = function () {
        this.sprite.draw(context,this.x,this.y);
    }
    I.inBounds = function () {
        return I.x >= 0 && I.x <= 480 && I.y >= 0 && I.y <= 320;
    }
    I.update = function () {
        I.x += I.xVelocity;
        I.y += 0.1;
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
        update();
        draw();
    }, 1000 / 30);
    console.log(intervalId);
});