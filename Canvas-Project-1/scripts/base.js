var context;
var PlayerBullets = [];
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
    draw: function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        PlayerBullets.forEach(function(b){
            b.draw();
        });
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
    PlayerBullets.forEach((b) =>{
        b.update();
    });
    PlayerBullets.filter((b) =>{
        return b.active;
    });
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
    }
    return I;
}
$(document).ready(function () {
    console.log("ready!");
    initialize();
    var canvas = document.getElementById("play");
    var ctx = canvas.getContext("2d");
    context = canvas.getContext("2d");
    var intervalId = setInterval(function () {
        ctx.clearRect(0, 0, 480, 320);
        update();
        player.draw(ctx);
    }, 1000 / 30);
    console.log(intervalId);
});