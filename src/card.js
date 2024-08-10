class Deck { 
    constructor(deck) {
        this.deck = deck;
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        return this.deck;
    }

    draw() {
        if (this.deck.length === 0) {
            throw new Error("The deck is empty. Cannot draw a card.");
        }
        return this.deck.pop();
    }

}

class Creator extends Deck {
    constructor(name, deck, board, hand) {
        super(deck);
        this.name = name;
        this.board = board;
        this.hand = hand;
        this.isFirstDraw = true;
    }

    drawCard(who) {
        if (this.isFirstDraw) {
            this.isFirstDraw = false;
            this.drawMultipleCards(5,who);
        } else {
            this.drawSingleCard(who);
        }
    }

    drawMultipleCards(count,who) {
        for (let i = 0; i < count; i++) {
            this.drawSingleCard(who);
        }
    }

    drawSingleCard(who) {
        try {
            const drawnCard = this.draw();
            this.hand.push(drawnCard);
            jsToHtml(drawnCard, who)
        } catch (error) {
            console.error(error.message);
        }
    }
}