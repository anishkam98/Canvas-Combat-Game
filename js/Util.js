class Util {
    isAttackCollision({ object1, object2 }) {
        return object1.attackBox.position.x + object1.attackBox.width >= object2.position.x &&
        object2.position.x + object2.width >= object1.attackBox.position.x + object1.attackBox.width &&
        object1.attackBox.position.y + object1.attackBox.height >= object2.position.y &&
        object2.position.y + object2.height >= object1.attackBox.position.y + object1.attackBox.height
    }
    
    startGame(player, player2, timeLimit) {
        document.querySelector('#timer').textContent = String(timeLimit);
        let currentTime = parseInt(document.querySelector('#timer').textContent);
    
        const interval = setInterval(() => {
            currentTime--;
            document.querySelector('#timer').textContent =  String(currentTime);
            if(currentTime === 0) {
                clearInterval(interval);
                this.determineWinner({player, player2});
            }
        }, 1000);
    }

    determineWinner({ player, player2 }) {
        document.querySelector('#menu-container').style.display = 'flex';
        if(player.health === player2.health) {
            document.querySelector('#winner-name').textContent = 'Tie';
        }
        else if(player.health > player2.health) {
            document.querySelector('#winner-name').textContent = 'Player 1';
        }
        else if(player.health < player2.health) {
            document.querySelector('#winner-name').textContent = 'Player 2';
        }
    }
}