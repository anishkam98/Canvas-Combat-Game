class Util {
    isGameRunning = false;
    interval;
    players = {player1: {}, player2: {}}
    time = 0;

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
    
    startMatch(player, player2, timeLimit) {
        this.time = timeLimit;
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

    startGame(player, player2, timeLimit, mapSelection) {
        this.players.player1 =  {player: player, wins: 0};
        this.players.player2 = {player: player2, wins: 0};
        let mapImage = './assets/images/game-map-backgrounds/Summer' + mapSelection +'.png';

        background =  new Sprite({
            position: {
                x: 0,
                y: 0
            },
            imageSource: mapImage,
            isBackground: true
        })
        animate();
        requestAnimationFrame(animate);

        this.startMatch(player, player2, timeLimit);
        document.querySelector('#stats-container').style.display = 'flex';
        document.querySelector('#menu-container').style.display = 'none';
        document.querySelector('#start-menu').style.display = 'none';
    }

    determineWinner({ player, player2 }) {
        this.isGameRunning = false;
        clearInterval(this.interval);
        this.stopPlayers({ player, player2 });

        

        if(player.health > player2.health) {
            this.players.player1.wins++;
        }
        else if(player.health < player2.health) {
            this.players.player2.wins++;
        }

        if(this.players.player1.wins === 2 || this.players.player2.wins === 2) {
            this.openGameOverMenu(this.players.player1.player, this.players.player2.player)
        }
        else {
            this.openNextRoundMenu(this.players.player1.player, this.players.player2.player);
        }

    }

    startNextRound() {
        this.players.player1.player.health = 100;
        this.players.player1.player.isDead = false;
        document.querySelector('#player1-health-inner').style.width =  '100%';
        this.players.player2.player.health = 100;
        this.players.player2.player.isDead = false;
        document.querySelector('#player2-health-inner').style.width =  '100%';
        document.querySelector('#menu-container').style.display = 'none';
        document.querySelector('#next-round-menu').style.display = 'none';

        this.startMatch(this.players.player1.player, this.players.player2.player, this.time);
    }

    openNextRoundMenu(player, player2) {
        let winner;
        document.querySelector('#next-round-menu').style.display = 'flex';
        document.querySelector('#menu-container').style.display = 'flex';

        if(player.health === player2.health) {
            winner = 'Tie';
        }
        else if(player.health > player2.health) {
            winner = 'Player 1';
            document.querySelector('#player1-win-1').style.display = 'flex';
        }
        else if(player.health < player2.health) {
            winner = 'Player 2';
            document.querySelector('#player2-win-1').style.display = 'flex';
        }
        document.querySelector('#round-winner-name').textContent = winner;
    }

    openGameOverMenu(player, player2) {
        let winner;
        document.querySelector('#game-over-menu').style.display = 'flex';
        document.querySelector('#menu-container').style.display = 'flex';

        if(player.health === player2.health) {
            winner = 'Tie';
        }
        else if(player.health > player2.health) {
            winner = 'Player 1';
            document.querySelector('#player1-win-2').style.display = 'flex';
        }
        else if(player.health < player2.health) {
            winner = 'Player 2';
            document.querySelector('#player2-win-2').style.display = 'flex';
        }
        document.querySelector('#game-winner-name').textContent = winner;
    }

    stopPlayers({ player, player2 }) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        player2.velocity.x = 0;
        player2.velocity.y = 0;
    }
}