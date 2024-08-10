let hands = document.querySelectorAll("#hand");
let boards = document.querySelectorAll('#board');
let playerBoard = boards[1].querySelectorAll('.boardPlaceHolder');
let enemyBoard = boards[0].querySelectorAll('.boardPlaceHolder');
let dot = document.querySelector('.dot');

let j = 0;
var pb = []
var eb = []
for (let i = 0; i < playerBoard.length; i++) {
    let newObj = { bo: playerBoard[i], x: playerBoard[i].offsetLeft + playerBoard[i].offsetWidth / 2 - dot.offsetWidth / 2, y: playerBoard[i].offsetTop + playerBoard[i].offsetHeight / 2 }
    pb.push(newObj)
    newObj = { bo: enemyBoard[i], x: enemyBoard[i].offsetLeft + enemyBoard[i].offsetWidth / 2 - dot.offsetWidth / 2, y: enemyBoard[i].offsetTop + enemyBoard[i].offsetHeight / 2 }
    eb.push(newObj)
}

function jsToHtml(card, who) {
    let appCard = document.createElement('div')
    let nome = document.createElement('div')
    let vida = document.createElement('div')
    let img = document.createElement('div')
    let atk = document.createElement('div')
    appCard.className = "card"
    appCard.addEventListener("click", function () {
        cardSelected(card);
    })

    nome.className = "nome"
    vida.className = "hp"
    img.className = "img"
    atk.className = "atk"

    appCard.style.backgroundImage = `url(symbols/${card.cardImg})`
    nome.textContent = card.nome;
    vida.textContent = card.hp;
    img.style.backgroundImage = `url(monsters/${card.img})`;
    atk.textContent = card.dmg;

    hands[who].appendChild(appCard);
    appCard.appendChild(nome)
    appCard.appendChild(vida)
    appCard.appendChild(img)
    appCard.appendChild(atk)
}

function updateBoard(card, who) {
    for (let i = 0; i < 5; i++) {
        playerBoard[i].style.pointerEvents = "none"
        enemyBoard[i].style.pointerEvents = "none"
        playerBoard[i].style.animation = ""
        enemyBoard[i].style.animation = ""
    }
    let appCard = document.createElement('div')
    let nome = document.createElement('div')
    let vida = document.createElement('div')
    let img = document.createElement('div')
    let atk = document.createElement('div')
    appCard.className = "card"
    nome.className = "nome"
    vida.className = "hp"
    img.className = "img"
    atk.className = "atk"

    appCard.style.backgroundImage = `url(symbols/${card.cardImg})`
    nome.textContent = card.nome;
    vida.textContent = card.hp;
    img.style.backgroundImage = `url(monsters/${card.img})`;
    atk.textContent = card.dmg;

    let board = boards[who].querySelectorAll('.boardPlaceHolder')
    let j = who == 1 ? player.board.indexOf(card) : enemy.board.indexOf(card)
    board[j].appendChild(appCard);
    appCard.appendChild(nome)
    appCard.appendChild(vida)
    appCard.appendChild(img)
    appCard.appendChild(atk)

    card.checkActivation("PLACED")
}

function updateStats(arr, who) {
    if (who == 0) {
        for (let i = 0; i < arr.length; i++) {
            let j = enemy.board.indexOf(arr[i])
            let card = enemyBoard[j].querySelector('.card')
            let vida = card.querySelector('.hp')
            vida.style.color = enemy.board[j].hp < enemy.board[j].maxHp ? "red" : "white"
            let dmg = card.querySelector('.atk')
            dmg.style.color = enemy.board[j].dmg > enemy.board[j].maxDmg ? "green" : "white"
            vida.textContent = enemy.board[j].hp
            dmg.textContent = enemy.board[j].dmg
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            let j = player.board.indexOf(arr[i])
            let card = playerBoard[j].querySelector('.card')
            let vida = card.querySelector('.hp')
            vida.style.color = player.board[j].hp < player.board[j].maxHp ? "red" : "white"
            let dmg = card.querySelector('.atk')
            dmg.style.color = player.board[j].dmg > player.board[j].maxDmg ? "green" : "white"
            vida.textContent = player.board[j].hp
            dmg.textContent = player.board[j].dmg
        }
    }
}