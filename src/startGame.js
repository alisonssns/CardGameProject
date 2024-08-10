let enemy = new Creator("Enemy", enemyDeck, [0, 0, 0, 0, 0], []);
let player = new Creator("Player", playerDeck, [0, 0, 0, 0, 0], []);
enemy.shuffle();
enemy.drawCard(0);
player.shuffle();
player.drawCard(1);
document.addEventListener("DOMContentLoaded", function () {
    endTurn();
})
let playerCards
let enemyCards
let selectedCard = 0;

function cardSelected(card) {
    if (round % 2 != 0) {
        let i = player.hand.indexOf(card);
        playerCards = hands[1].querySelectorAll('.card')
        for (let n = 0; n < playerCards.length; n++) {
            playerCards[n].style.transform = "";
        }
        for (let m = 0; m < player.board.length; m++) {
            if (player.board[m] == 0) {
                playerBoard[m].style.pointerEvents = "all"
                playerBoard[m].style.animation = "select linear 1s infinite"
            }
        }
        playerCards[i].style.transform = "scale(1.1)"
        return selectedCard = i;
    } else {
        let i = enemy.hand.indexOf(card);
        enemyCards = hands[0].querySelectorAll('.card')
        for (let n = 0; n < enemyCards.length; n++) {
            enemyCards[n].style.transform = "";
        }
        for (let m = 0; m < enemy.board.length; m++) {
            if (enemy.board[m] == 0) {
                enemyBoard[m].style.pointerEvents = "all"
            }
        }
        enemyCards[i].style.transform = "scale(1.1)"
        return selectedCard = i;
    }
}

function addToBoard(i) {
    if (round % 2 != 0) {
        playerCards = hands[1].querySelectorAll('.card')
        playerCards[selectedCard].remove()
        let splicedCard = player.hand.splice(selectedCard, 1)[0];
        player.board[i] = splicedCard;
        updateBoard(player.board[i], 1)
    } else {
        enemyCards = hands[0].querySelectorAll('.card')
        enemyCards[selectedCard].remove()
        let splicedCard = enemy.hand.splice(selectedCard, 1)[0];
        enemy.board[i] = splicedCard;
        updateBoard(enemy.board[i], 0)
    }
}