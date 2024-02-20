const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.1;
const FRAME_RATE = 1000/60;
const util = new Util();

let background;

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
    speed: 2,
    offset: {
        x: 41,
        y: 20
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
        attack3: {
            imageSource: './assets/images/Samurai/Attack_3.png',
            framesMax: 3,
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
    speed: 2,
    offset: {
        x: 41,
        y: 20
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
        attack3: {
            imageSource: './assets/images/Fighter/Attack_3.png',
            framesMax: 4,
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
    q: {
        pressed: false
    },
    j: {
        pressed: false
    },
    l: {
        pressed: false
    },
    i: {
        pressed: false
    },
    u: {
        pressed: false
    },
    o: {
        pressed: false
    }
}

let lastFrame = 0;
let startTime;
function animate(time){  
    let deltaTime = 0
    let currentFrame;

    if(startTime === undefined){
        startTime = time;
    }else{
        currentFrame = Math.round((time - startTime) / FRAME_RATE);
        deltaTime = (currentFrame - lastFrame) * FRAME_RATE;
    }

    lastFrame = currentFrame;
    requestAnimationFrame(animate);

    context.fillStyle = 'green';
    context.fillRect(0, 0, canvas.width, canvas.height);
    if(background) {
        background.update();
    }
    
    player.update();
    player2.update();
    if(!util.isGameRunning) {
        return;
    }

    // Player movement
    player.velocity.x = 0;
    
    if(keys.a.pressed && player.lastKeyX === 'a') {
        player.direction = -1;
        player.velocity.x = player.position.x - player.offset.x > 0 ? -player.speed : 0;
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKeyX === 'd') {
        player.direction = 1;
        player.velocity.x =  player.position.x + player.offset.x < canvas.width ? player.speed : 0;
        player.switchSprite('run')
    }
    else {
        player.switchSprite('idle')
    }
    
    if(player.isDead) {
        player.switchSprite('death')
        util.determineWinner({ player, player2 });
    }

    // Detect collision from player 
    if(util.isAttackCollision({ object1: player, object2: player2 }) &&
        player.isAttacking) {
        player2.getHurt(player.damageDealt);
        document.querySelector('#player2-health-inner').style.width =  player2.health < 0 ? '0' : String(player2.health) + '%';
        player.isAttacking = false;
    }

    // player2 movement
    player2.velocity.x = 0;
    if(keys.j.pressed && player2.lastKeyX === 'j') {
        player2.direction = -1;
        player2.velocity.x = player2.position.x - player2.offset.x > 0 ? -player2.speed : 0;
        player2.switchSprite('run')
    }
    else if(keys.l.pressed && player2.lastKeyX === 'l') {
        player2.direction = 1;
        player2.velocity.x =  player2.position.x + player2.offset.x < canvas.width ? player2.speed : 0;
        player2.switchSprite('run')
    }
    else {
        player2.switchSprite('idle')
    }

    if(player2.isDead) {
        player2.switchSprite('death')
        util.determineWinner({ player, player2 });
    }

    // Detect collision from player2 
    if(util.isAttackCollision({ object1: player2, object2: player }) &&
        player2.isAttacking) {
        player.getHurt(player2.damageDealt);
        document.querySelector('#player1-health-inner').style.width =  player.health < 0 ? '0' : String(player.health) + '%';
        player2.isAttacking = false;
    }
}

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
            player.lightAttack();
            break;
        case 'q':
            keys.q.pressed = true;
            player.heavyAttack();
            break;
        case 'j':
            keys.j.pressed = true;
            player2.lastKeyX = 'j';
            break;
        case 'l':
            keys.l.pressed = true;
            player2.lastKeyX = 'l';
            break;
        case 'i':
            keys.i.pressed = true;
            player2.jump();
            break;
        case 'u':
            keys.u.pressed = true;
            player2.lightAttack();
            break;
        case 'o':
            keys.o.pressed = true;
            player2.heavyAttack();
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
        case 'q':
            keys.q.pressed = false;
            break;
        case 'j':
            keys.j.pressed = false;
            break;
        case 'l':
            keys.l.pressed = false;
            break;
        case 'i':
            keys.i.pressed = false;
            break;
        case 'u':
            keys.u.pressed = false;
            break;
        case 'o':
            keys.o.pressed = false;
            break;
    }
})