class Util {
    isGameRunning = false;
    interval;

    isAttackCollision({ object1, object2 }) {
        return this.isHorizontalCollision({ object1, object2 }) && this.isVerticalCollision({ object1, object2 });
    }

    isVerticalCollision({ object1, object2 }) {
        return object1.attackBox.position.y + object1.attackBox.height >= object2.position.y &&
        object2.position.y + object2.height >= object1.attackBox.position.y + object1.attackBox.height;
    }

    isHorizontalCollision({ object1, object2 }) {
        return (object1.direction > 0 && 
        object1.attackBox.position.x + object1.attackBox.width >= object2.position.x &&
        object2.position.x + object2.width >= object1.attackBox.position.x) || 
        (object1.direction < 0 && 
            object1.position.x - object1.attackBox.width <= object2.position.x + object2.width  &&
            object2.position.x <= object1.position.x);
    }
    
    startGame(player, player2, timeLimit) {
        document.querySelector('#timer').textContent = String(timeLimit);
        let currentTime = parseInt(document.querySelector('#timer').textContent);
        this.isGameRunning = true;
    
        this.interval = setInterval(() => {
            currentTime--;
            document.querySelector('#timer').textContent =  String(currentTime);
            if(currentTime === 0) {
                this.determineWinner({player, player2});
            }
        }, 1000);
    }

    determineWinner({ player, player2 }) {
        this.isGameRunning = false;
        clearInterval(this.interval);
        this.stopPlayers({ player, player2 });
        let winner;
        document.querySelector('#menu-container').style.display = 'flex';

        if(player.health === player2.health) {
            winner = 'Tie';
        }
        else if(player.health > player2.health) {
            winner = 'Player 1';
        }
        else if(player.health < player2.health) {
            winner = 'Player 2';
        }
        document.querySelector('#winner-name').textContent = winner;
    }

    stopPlayers({ player, player2 }) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        player2.velocity.x = 0;
        player2.velocity.y = 0;
    }
}