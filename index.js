const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.7;
const TIME_LIMIT = 180;
const util = new Util();

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSource: './assets/images/Summer7.png',
    isBackground: true
})

const player = new Fighter({
    position: {
        x: 256,
        y: 0
    },
    direction: 1,
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 41,
        y: 45
    },
    attackboxOffset: {
        x: 0,
        y: 30
    },
    scale: 1,
    imageSource: './assets/images/Samurai/Idle.png',
    framesMax: 6,
    sprites: {
        idle: {
            imageSource: './assets/images/Samurai/Idle.png',
            framesMax: 6,
        },
        run: {
            imageSource: './assets/images/Samurai/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSource: './assets/images/Samurai/Jump.png',
            framesMax: 12,
        },
        attack1: {
            imageSource: './assets/images/Samurai/Attack_1.png',
            framesMax: 6,
        },
        attack2: {
            imageSource: './assets/images/Samurai/Attack_2.png',
            framesMax: 4,
        },
        hurt: {
            imageSource: './assets/images/Samurai/Hurt.png',
            framesMax: 2,
        },
        death: {
            imageSource: './assets/images/Samurai/Dead.png',
            framesMax: 3,
        }
    }
})

const player2 = new Fighter({
    position: {
        x: 512,
        y: 100
    },
    direction: -1,
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 41,
        y: 45
    },
    attackboxOffset: {
        x: 0,
        y: 30
    },
    scale: 1,
    imageSource: './assets/images/Fighter/Idle.png',
    framesMax: 6,
    sprites: {
        idle: {
            imageSource: './assets/images/Fighter/Idle.png',
            framesMax: 6,
        },
        run: {
            imageSource: './assets/images/Fighter/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSource: './assets/images/Fighter/Jump.png',
            framesMax: 10,
        },
        attack1: {
            imageSource: './assets/images/Fighter/Attack_1.png',
            framesMax: 4,
        },
        attack2: {
            imageSource: './assets/images/Fighter/Attack_2.png',
            framesMax: 3,
        },
        hurt: {
            imageSource: './assets/images/Fighter/Hurt.png',
            framesMax: 3,
        },
        death: {
            imageSource: './assets/images/Fighter/Dead.png',
            framesMax: 3,
        }
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
    background.update();
    player.update();
    player2.update();
    if(!util.isGameRunning) {
        return;
    }

    // Player movement
    player.velocity.x = 0;
    
    if(keys.a.pressed && player.lastKeyX === 'a') {
        player.direction = -1;
        player.velocity.x = -5;
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKeyX === 'd') {
        player.direction = 1;
        player.velocity.x = 5;
        player.switchSprite('run')
    }
    else {
        player.switchSprite('idle')
    }
    

    // Detect collision from player 
    if(util.isAttackCollision({ object1: player, object2: player2 }) &&
        player.isAttacking) {
        player2.getHurt();
        document.querySelector('#player2-health-inner').style.width =  String(player2.health) + '%';
        player.isAttacking = false;
    }

    // player2 movement
    player2.velocity.x = 0;
    if(keys.ArrowLeft.pressed && player2.lastKeyX === 'ArrowLeft') {
        player2.direction = -1;
        player2.velocity.x = -5;
        player2.switchSprite('run')
    }
    else if(keys.ArrowRight.pressed && player2.lastKeyX === 'ArrowRight') {
        player2.direction = 1;
        player2.velocity.x = 5;
        player2.switchSprite('run')
    }
    else {
        player2.switchSprite('idle')
    }

     // Detect collision from player2 
    if(util.isAttackCollision({ object1: player2, object2: player }) &&
        player2.isAttacking) {
        player.getHurt();
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
            player.jump();
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
            player2.jump();
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