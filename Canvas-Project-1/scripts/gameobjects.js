var shield = {
    draw: function () {
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.moveTo(0, 250);
        context.lineTo(480, 250);
        context.stroke();
    }
}

//player

var player = {
    color: "#00A",
    x: 220,
    y: 270,
    width: 32,
    height: 32,
    sprite: Sprite("jet"),
    draw: function () {
        this
            .sprite
            .draw(context, this.x, this.y);
    },
    midpoint: function () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    },
    shoot: function () {
        var bulletPos = this.midpoint();
        PlayerBullets.push(bullet({speed: 5, x: bulletPos.x, y: bulletPos.y}));
    },
    explode: function () {
        stopFunction(window.interval_id);
    },
    reset: function () {
        player.x = 220;
        player.y = 270;
    }
}

//bullet constructor

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

//Enemy Constructor

function Enemy(I) {
    I = I || {};
    I.active = true;
    I.x = 480 / 4 + Math.random() * (240);
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = 1;
    I.width = 32;
    I.height = 32;
    I.color = "#A2B";
    I.age = Math.floor(Math.random() * 128);
    I.sprite = Sprite("smallenemy");
    I.type = "smallenemy";
    I.draw = function () {
        this
            .sprite
            .draw(context, this.x, this.y);
    }
    I.inBounds = function () {
        return I.x >= 0 && I.x <= 480 && I.y >= 0 && I.y <= 320;
    }
    I.explode = function () {
        this.active = false;
    }
    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;
        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
        I.age++;
        I.active = I.active && I.inBounds();
    }
    return I;
}

// special Enemy Constructor

function BIGEnemy(I) {
    I = I || {};
    I.active = true;
    I.x = 480 / 4 + Math.random() * (250);
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = 3;
    I.width = 32;
    I.height = 32;
    I.color = "#A2B";
    I.age = Math.floor(Math.random() * 128);
    I.sprite = Sprite("bigenemy");
    I.type = "bigenemy";
    I.draw = function () {
        this
            .sprite
            .draw(context, this.x, this.y);
    }
    I.inBounds = function () {
        return I.x >= 0 && I.x <= 480 && I.y >= 0 && I.y <= 320;
    }
    I.explode = function () {
        this.active = false;
    }
    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;
        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
        I.age++;
        I.active = I.active && I.inBounds();
    }
    return I;
}