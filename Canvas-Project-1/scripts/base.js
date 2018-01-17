Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
// return key name
var keyName = function (event) {
    return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
}
// key binding function
var initialize = function () {
    window.keydown = {};
    $(document).bind("keydown",function (event) {
        keydown[keyName(event)] = true;
    });
    $(document).bind("keyup",function (event) {
        keydown[keyName(event)] = false;
    });
}
var player = {
    color: "00A",
    x: 220,
    y: 270,
    width: 32,
    height: 32,
    draw: function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    shoot: function () {
        console.log("Pew Pew");  
    }
}
var stopFunction = function (id) {
    clearInterval(id);
}
var updatePlayerPosition = function () {
    if(keydown.left)
    {
        player.x -=5;
        //console.log("MOVE LEFT");
    }
    if(keydown.right)
    {
        player.x +=5;
        //console.log("MOVE LEFT");
    }
    if(keydown.space)
    {
        player.shoot();
    }
    player.x = player.x.clamp(0,480-player.width);
}
$(document).ready(function () {
    console.log("ready!");
    initialize();
    var canvas = document.getElementById("play");
    var ctx = canvas.getContext("2d");
    var intervalId = setInterval(function () {
        ctx.clearRect(0,0,480,320);
        updatePlayerPosition();
        player.draw(ctx);
    }, 1000 / 30);
    console.log(intervalId);
});