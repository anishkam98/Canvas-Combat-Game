const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.7;
const TIME_LIMIT = 5;
const util = new Util();

class Sprite {
    constructor({ position, velocity , color, offset }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.lastKeyX;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    
        // Attack box
        if(this.isAttacking) {
            context.fillStyle = 'green';
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }    
    }

    move() {

    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    update() {
        this.draw();
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + 40;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
        else {
            this.velocity.y += GRAVITY;
        }
    }
}

const player = new Sprite({
    position: {
        x: 256,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    }
})

const player2 = new Sprite({
    position: {
        x: 512,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    e: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    slash: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    player2.update();

    // Player movement
    player.velocity.x = 0;
    if(keys.a.pressed && player.lastKeyX === 'a') {
        player.velocity.x = -5;
    }
    else if(keys.d.pressed && player.lastKeyX === 'd') {
        player.velocity.x = 5;
    }

    // player2 movement
    player2.velocity.x = 0;
    if(keys.ArrowLeft.pressed && player2.lastKeyX === 'ArrowLeft') {
        player2.velocity.x = -5;
    }
    else if(keys.ArrowRight.pressed && player2.lastKeyX === 'ArrowRight') {
        player2.velocity.x = 5;
    }

    // Detect collision from player 
    if(util.isAttackCollision({ object1: player, object2: player2 }) &&
        player.isAttacking) {
        console.log('attack from player1')
        player2.health += -5;
        document.querySelector('#player2-health-inner').style.width =  String(player2.health) + '%';
        player.isAttacking = false;
    }

     // Detect collision from player2 
    if(util.isAttackCollision({ object1: player2, object2: player }) &&
        player2.isAttacking) {
        console.log('attack from player2')
        player.health += -5;
        document.querySelector('#player1-health-inner').style.width =  String(player.health) + '%';
        player2.isAttacking = false;
    }
}

animate()
util.startGame(player, player2, TIME_LIMIT);

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'a':
            keys.a.pressed = true;
            player.lastKeyX = 'a';
            break;
        case 'd':
            keys.d.pressed = true;
            player.lastKeyX = 'd';
            break;
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -15;
            break;
        case 'e':
            keys.e.pressed = true;
            player.attack();
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            player2.lastKeyX = 'ArrowLeft';
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            player2.lastKeyX = 'ArrowRight';
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            player2.velocity.y = -15;
            break;
        case '/':
            keys.slash.pressed = true;
            player2.attack();
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 'e':
            keys.e.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case '/':
            keys.slash.pressed = false;
            break;
    }
})