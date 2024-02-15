class Sprite {
    constructor({ position, imageSource, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, isBackground }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSource;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
        this.isBackground = isBackground;
    }

    draw() {
        if(this.isBackground) {
            context.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            );
        }
        else {
            if(this.direction > 0) {
                context.drawImage(
                    this.image,
                    this.framesCurrent * (this.image.width / this.framesMax),
                    0,
                    this.image.width / this.framesMax,
                    this.image.height,
                    this.position.x - this.offset.x,
                    this.position.y - this.offset.y,
                    (this.image.width / this.framesMax) * this.scale,
                    this.image.height * this.scale
                );
            }
            else if(this.direction < 0) {
                context.scale(-1,1);
                context.drawImage(
                    this.image,
                    this.framesCurrent * (this.image.width / this.framesMax),
                    0,
                    this.image.width / this.framesMax,
                    this.image.height,
                    -this.position.x - this.offset.x,
                    this.position.y - this.offset.y,
                    (this.image.width / this.framesMax) * this.scale,
                    this.image.height * this.scale
                );
                context.resetTransform();
            }
        }
        

    }

    animateFrames() {
        this.framesElapsed++
    
        if (this.framesElapsed % this.framesHold === 0) {
          if (this.framesCurrent < this.framesMax - 1) {
            this.framesCurrent++;
          } else {
            this.framesCurrent = 0;
          }
        }
      }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({ position, direction, velocity, color, imageSource, scale = 1, framesMax = 1, sprites, offset = { x: 0, y: 0 } }, attackboxOffset = { x: 0, y: 0 }, isBackground = false) {
        super({ position, imageSource, scale, framesMax,  offset });
        this.direction = direction;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            attackboxOffset: {
                x: attackboxOffset.x,
                y: attackboxOffset.y
            },
            width: 50,
            height: 80
        }
        this.color = color;
        this.isAttacking;
        this.lastKeyX;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.canMove = true;
        this.sprites = sprites;

        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSource;
        }
    }

    /*draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    
        // Attack box
        if(this.isAttacking && util.isGameRunning) {
            if(this.direction > 0) {
                context.fillStyle = 'green';
                context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
            }
            else if(this.direction < 0) {
                context.scale(-1,1);
                context.fillStyle = 'green';
                context.fillRect(-this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
                context.resetTransform();
            }
        }    
    }*/

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    getHurt() {
        this.switchSprite('hurt');
        this.health += -5;
    }

    jump(){
        this.switchSprite('jump');
        this.velocity.y = -15;
    }

    update() {
        this.draw();
        this.animateFrames();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        if(this.direction > 0) {
            this.attackBox.position.x = this.position.x + this.width + this.attackBox.attackboxOffset.x;
        }
        else if(this.direction < 0) {
            this.attackBox.position.x = this.position.x;
        }
        
        this.attackBox.position.y = this.position.y + this.attackBox.attackboxOffset.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
        else {
            this.velocity.y += GRAVITY;
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
          if (this.framesCurrent === this.sprites.death.framesMax - 1)
            this.dead = true
          return;
        }
    
        // overriding all other animations with the attack animation
        if (
          this.image === this.sprites.attack1.image &&
          this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
          return;
    
        // override when fighter gets hit
        if (this.image === this.sprites.hurt.image &&
          this.framesCurrent < this.sprites.hurt.framesMax - 1)
          return;
    

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image;
                this.framesMax = this.sprites.idle.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                this.image = this.sprites.run.image;
                this.framesMax = this.sprites.run.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                this.image = this.sprites.jump.image;
                this.framesMax = this.sprites.jump.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                this.image = this.sprites.attack1.image;
                this.framesMax = this.sprites.attack1.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'attack2':
                if (this.image !== this.sprites.attack2.image) {
                    this.image = this.sprites.attack2.image;
                    this.framesMax = this.sprites.attack2.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'hurt':
                if (this.image !== this.sprites.hurt.image) {
                this.image = this.sprites.hurt.image;
                this.framesMax = this.sprites.hurt.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                this.image = this.sprites.death.image;
                this.framesMax = this.sprites.death.framesMax;
                this.framesCurrent = 0;
                }
                break;
        }
      }
}