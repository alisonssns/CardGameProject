class Card {

    static nextId = 1;

    constructor(nome, img, cardImg, dmg, hp, effects = [], maxActivations) {
        this.id = Card.nextId++;
        this.nome = nome;
        this.img = img;
        this.cardImg = cardImg;
        this.dmg = dmg;
        this.maxDmg = dmg;
        this.hp = hp;
        this.maxHp = hp;
        this.effects = effects;
        this.poisoned = false;
        this.effects.forEach(effect => effect.card = this);
        this.activations = 0;
        this.maxActivations = maxActivations;
    }

    checkActivation(event) {
        if (this.effects.length > 0) {
            this.effects.forEach(effect => {
                if (this.activations < this.maxActivations && event === effect.triggerEvent && effect.canActivate(this)) {
                    effect.execute(this);
                }
            });
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        this.checkActivation("TAKE_DMG");
        console.log(`${this.nome} agora tem ${this.hp} de vida.`);
    }

    attack(target) {
        console.log(`${this.nome} ataca ${target.nome}`);
        this.checkActivation("DEAL_DMG")
        target.takeDamage(this.dmg);
    }
}

class Effect {
    constructor(triggerEvent, condition, action, maxActivations) {
        this.triggerEvent = triggerEvent;
        this.condition = condition;
        this.action = action;
    }

    canActivate(card) {
        return this.condition(card);
    }

    execute(card) {
        let playerCard = player.board.find(cards => cards.id === card.id);
        let enemyCard = enemy.board.find(cards => cards.id === card.id);
        if (playerCard) {
            let i = player.board.indexOf(card)
            this.action(card, player.board, i, 1, enemy.board, enemyBoard, 0);
        } else if (enemyCard) {
            let i = enemy.board.indexOf(card)
            this.action(card, enemy.board, i, 0, player.board, playerBoard, 1);
        }
        card.activations++;;
    }
}

function noCondition() {
    return true;
}

function healthCondition(card) {
    return card.hp < card.maxHp;
}

function increaseAttackAction(card) {
    card.dmg += 3;
    console.log(`${card.nome} agora tem ${card.dmg} de ataque!`);
}

function repelDamage(card, board, i, who, enemy, eboard, enWho) {
    enemy[i].hp--;
    updateStats([enemy[i]], enWho)
    setTimeout(() => {
        if (enemy[i].hp <= 0) {
            dead(enemy, eboard[i], i)
        }
    }, 550)
}

function weakOpponent(card, board, i, who, enemy) {
    if (enemy[i].dmg > 0) {
        enemy[i].dmg--;
    }
}

function healAllies(card, board, i) {
    var all1 = board[i - 1]
    var all2 = board[i + 1]
    var pB1 = board[i - 1]
    var pB2 = board[i + 1]

    if (all1 && all1.hp < all1.maxHp) {
        all1.hp += 2;
        if (all1.hp > all1.maxHp) { all1.hp = all1.maxHp }
        pB1.style.animation = "heal 0.3s ease";
        setTimeout(() => {
            pB1.style.animation = "";
        }, 300);
        updateStats([all1], who)
    }
    if (all2 && all2.hp < all2.maxHp) {
        all2.hp += 2;
        if (all2.hp > all2.maxHp) { all2.hp = all2.maxHp }
        pB2.style.animation = "heal 0.3s ease";
        setTimeout(() => {
            pB2.style.animation = "";
        }, 300);
        updateStats([all1], who)
    }
}

function createTokens(card, board, i, who) {
    if (!board[i - 1] && board[i - 1] >= 0) {
        board[i - 1] = new Card("Token", "phaseOne.png", "normal.png", 0, 3)
        updateBoard(board[i - 1], who)
    }
    if (!board[i + 1] && board[i + 1] < 5) {
        board[i + 1] = new Card("Token", "phaseOne.png", "normal.png", 0, 3)
        updateBoard(board[i + 1], who)
    }
}

function killTarget(card, board, i, who, enemy) {
    enemy[i].hp = 0;
}

function protection(card) {
    card.hp = card.maxHp;
}

function splashDamage(card, board, i, who, enemy, eboard, enwho) {
    setTimeout(() => {
        if (enemy[i - 1]) {
            enemy[i - 1].hp -= 1
            updateStats([enemy[i - 1]], enwho)
        }
        if (enemy[i + 1]) {
            enemy[i + 1].hp -= 1
            updateStats([enemy[i + 1]], enwho)
        }
    }, 300);
}

function generateSnake(card, board, i, who, enemy, eboard) {
    setTimeout(() => {
        board[i] = new Card("Cobra", "Cobra.png", "cardPoison.png", 1, 1, [PoisonEffect], 99)
        updateBoard(board[i], who)
    }, 500);
}

let multiplyEffect = new Effect("PLACED", noCondition, createTokens)
let BerserkEffect = new Effect("TAKE_DMG", healthCondition, increaseAttackAction);
let HealEffect = new Effect("TURN_END", noCondition, healAllies);
let RepelEffect = new Effect("TAKE_DMG", noCondition, repelDamage)
let weakEffect = new Effect("DEAL_DMG", noCondition, weakOpponent)
let PoisonEffect = new Effect("DEAL_DMG", noCondition, killTarget)
let ShieldEffect = new Effect("TAKE_DMG", noCondition, protection)
let SplashEffect = new Effect("DEAL_DMG", noCondition, splashDamage)
let GenEffect = new Effect("RIP", noCondition, generateSnake)

let playerDeck = [
    new Card("Bicefálico Enfurecido", "bice.png", "cardBerserk.png", 0, 3, [BerserkEffect], 1),
    new Card("Mascara Devoradora", "masc.png", "cardWeak.png", 1, 7, [weakEffect], 99),
    new Card("Mascara Devoradora", "masc.png", "cardWeak.png", 2, 5, [weakEffect], 99),
    new Card("Espectro Prolificador", "espec.png", "cardFire.png", 3, 8, [multiplyEffect], 99),
    new Card("Micótico Curador", "cogu.png", "cardHeal.png", 1, 6, [HealEffect], 99),
    new Card("Micótico Curador", "cogu.png", "cardHeal.png", 2, 4, [HealEffect], 99),
    new Card("Espinhazul", "espi.png", "cardThorn.png", 3, 9, [RepelEffect], 99),
    new Card("Golem de Gosma", "golem.png", "cardPoison.png", 1, 2, [PoisonEffect], 99),
    new Card("Bicefálico Enfurecido", "bice.png", "cardBerserk.png", 0, 10, [BerserkEffect], 1),
    new Card("Cervo Cristalino", "cris.png", "cardShield.png", 4, 1, [SplashEffect], 1),
    new Card("Cabra Infectada", "infect.png", "normal.png", 2, 1, [GenEffect], 99),
    new Card("Ovelha Armadurada", "armour.png", "normal.png", 4, 1, [ShieldEffect], 1),
];

let enemyDeck = [
    new Card("Bicefálico Enfurecido", "bice.png", "cardBerserk.png", 0, 3, [BerserkEffect], 1),
    new Card("Mascara Devoradora", "masc.png", "cardWeak.png", 1, 7, [weakEffect], 99),
    new Card("Mascara Devoradora", "masc.png", "cardWeak.png", 2, 5, [weakEffect], 99),
    new Card("Espectro Prolificador", "espec.png", "cardFire.png", 3, 8, [multiplyEffect], 99),
    new Card("Micótico Curador", "cogu.png", "cardHeal.png", 1, 6, [HealEffect], 99),
    new Card("Micótico Curador", "cogu.png", "cardHeal.png", 2, 4, [HealEffect], 99),
    new Card("Espinhazul", "espi.png", "cardThorn.png", 3, 9, [RepelEffect], 99),
    new Card("Golem de Gosma", "golem.png", "cardPoison.png", 1, 2, [PoisonEffect], 99),
    new Card("Bicefálico Enfurecido", "bice.png", "cardBerserk.png", 0, 10, [BerserkEffect], 1),
    new Card("Cervo Cristalino", "cris.png", "cardShield.png", 4, 1, [SplashEffect], 1),
    new Card("Cabra Infectada", "infect.png", "normal.png", 2, 1, [GenEffect], 99),
    new Card("Ovelha Armadurada", "armour.png", "normal.png", 4, 1, [ShieldEffect], 1),
];