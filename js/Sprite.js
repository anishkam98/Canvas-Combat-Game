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
        this.isDead = false;
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
        this.framesElapsed++;
    
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } 
            else if(!this.isDead) {
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
    constructor({ position, direction, velocity, speed = 5, imageSource, scale = 1, framesMax = 1, sprites, offset = { x: 0, y: 0 } }, attackboxOffset = { x: 0, y: 0 }, isBackground = false, isDead = false) {
        super({ position, imageSource, scale, framesMax,  offset, isDead });
        this.direction = direction;
        this.velocity = velocity;
        this.speed = speed;
        this.height = 150;
        this.width = 50;
        this.health = 100;
        this.damageDealt = 0;
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
        this.jumpCount = 0;
        this.lightAttackCount = 0;
        this.isAttacking;
        this.lastKeyX;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 20;
        this.canMove = true;
        this.sprites = sprites;

        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSource;
        }
    }

    drawAttackBox() {
        // Attack box
        if(this.isAttacking && util.isGameRunning) {
            if(this.direction > 0) {
                context.fillStyle = 'green';
                context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
            }
            else if(this.direction < 0) {
                context.scale(-1,1);
                context.fillStyle = 'green';
                context.fillRect(-this.attackBox.position.x + this.offset.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
                context.resetTransform();
            }
        }  
    }

    lightAttack() {
        this.lightAttackCount++;
        this.damageDealt = 2;

        if(this.lightAttackCount === 1) {
            this.switchSprite('attack1');
            this.isAttacking = true;
            
        }
        else if(this.lightAttackCount === 2) {
            this.switchSprite('attack2');
            this.isAttacking = true;
            
        }

        setTimeout(() => {
            this.isAttacking = false;
            this.lightAttackCount = 0;
            this.damageDealt = 0;
        }, 500)
    }

    heavyAttack() {
        this.damageDealt = 10;
        this.switchSprite('attack3');
        this.isAttacking = true;

        setTimeout(() => {
            this.isAttacking = false;
            this.damageDealt = 0;
        }, 600)
    }

    getHurt(damage) {
        this.health -= damage;
        
        if(this.health <= 0) {
            this.isDead = true;
        } else {
            this.switchSprite('hurt');
        }
    }

    jump(){
        this.jumpCount++;
        
        if(this.jumpCount <= 2) {
            this.switchSprite('jump');
            this.velocity.y = -5;
        }
    }



    update() {
        this.draw();
        //this.drawAttackBox();
        this.animateFrames();

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;        
        
        if(this.direction > 0) {
            this.attackBox.position.x = this.position.x + this.width + this.attackBox.attackboxOffset.x;
        }
        else if(this.direction < 0) {
            this.attackBox.position.x = this.position.x;
        }
        
        this.attackBox.position.y = this.position.y + this.attackBox.attackboxOffset.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.jumpCount = 0;
        }
        else {
            this.velocity.y += GRAVITY;
        }

        if(!this.isDead && !util.isGameRunning) {
            this.switchSprite('idle');
        }
    }

    switchSprite(sprite) {

        // Override all other animations with the death animation
        if (this.image === this.sprites.death.image && 
            this.framesCurrent < this.sprites.death.framesMax - 1) {
          return;
        }
    
        // Override all other animations with the attack animations
        if ((this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1) || 
            (this.image === this.sprites.attack2.image &&
            this.framesCurrent < this.sprites.attack2.framesMax - 1) || 
            (this.image === this.sprites.attack3.image &&
            this.framesCurrent < this.sprites.attack3.framesMax - 1)) {
            return;
        }
          
    
        // Override all other animations with the hurt animation
        if (this.image === this.sprites.hurt.image &&
          this.framesCurrent < this.sprites.hurt.framesMax - 1) {
            return;
        }

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image &&
                    this.velocity.y === 0) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image &&
                    this.velocity.y === 0) {
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
            case 'attack3':
                if (this.image !== this.sprites.attack3.image) {
                    this.image = this.sprites.attack3.image;
                    this.framesMax = this.sprites.attack3.framesMax;
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