let round = 0;
let turno = 0;
function endTurn() {
    playerCards = hands[1].querySelectorAll('.card')
    enemyCards = hands[0].querySelectorAll('.card')
    round++;
    if (round % 2 != 0) {
        turno++;
        console.log("Turno atual é ", turno)
    }
    if (round % 2 == 0) {
        for (let i = 0; i < playerBoard.length; i++) {
            if (player.board[i] !== 0) {
                player.board[i].checkActivation("TURN_END");
            }
        }
        checkAttack("Player")
        hands[1].style.pointerEvents = "none"
        hands[0].style.pointerEvents = "all"
    } else {
        for (let i = 0; i < enemyBoard.length; i++) {
            if (enemy.board[i] !== 0) {
                enemy.board[i].checkActivation("TURN_END");
            }
        }
        checkAttack("Enemy")
        hands[0].style.pointerEvents = "none"
        hands[1].style.pointerEvents = "all"
    }
}

function checkAttack(who) {
    switch (who) {
        case "Player":
            for (let i = 0; i < player.board.length; i++) {
                if (player.board[i] != 0 && enemy.board[i] != 0) {
                    if (player.board[i].dmg <= 0) { } else {
                        player.board[i].attack(enemy.board[i])
                        let cardAnim = playerBoard[i].querySelector('.card')
                        cardAnim.style.animation = 'attack 0.5s ease'
                        setTimeout(() => {
                            updateStats([enemy.board[i]], 0)
                            createEffect(enemyBoard[i], enemy.board, i)
                            if (enemy.board[i].hp <= 0) { dead(enemy.board, enemyBoard[i], i) }

                        }, 300);
                        setTimeout(() => {
                            cardAnim.style.animation = ''
                        }, 500);
                    }
                }
            } break;

        case "Enemy":
            for (let i = 0; i < enemy.board.length; i++) {
                if (enemy.board[i] != 0 && player.board[i] != 0) {
                    if (enemy.board[i].dmg <= 0) { } else {
                        enemy.board[i].attack(player.board[i])
                        let cardAnim = enemyBoard[i].querySelector('.card')
                        cardAnim.style.animation = 'attackE 0.5s ease'
                        setTimeout(() => {
                            updateStats([player.board[i]], 1)
                            createEffect(playerBoard[i], player.board, i)
                            if (player.board[i].hp <= 0) { dead(player.board, playerBoard[i], i) }
                        }, 300);
                        setTimeout(() => {
                            cardAnim.style.animation = ''
                        }, 500);
                    }
                }
            } break;
    }
}

function createEffect(where) {
    let eff = document.createElement('div')
    eff.className = "eff";
    where.appendChild(eff)
    where.style.opacity = '0.8'
    setTimeout(() => {
        where.style.opacity = '1'
    }, 300);
}

function dead(card, where, i) {
    card[i].checkActivation("RIP")
    let boardCard = where.querySelector('.card')
    console.log(card[i].nome, "morreu")
    card[i] = 0
    boardCard.style.animation = "kill 0.5s forwards"
    setTimeout(() => {
        where.removeChild(boardCard)
    }, 500);
}