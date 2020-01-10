/* create a deck of cards
   game starts with shuffling deck and dealing 2 cards to each player
   these cards get subtracted from the top left playing deck
   add up the values of player's current cards and show
   * Ace can be 1 or 11 depending on the point total 
   if they're under 21, they can Hit and draw another card
   if they go over 21, they lose
   if they stand, it's dealers turn
   dealer Hits until they have at least 17
   then they stand, or bust
   after dealer's turn ends, compare the players points and declare the winner
   Hit and Stand buttons are disabled
   can hit Restart to restart the game
   then the deck will shuffle and game will restart
*/


// creating a deck of cards

const value = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suite = ['H', 'D', 'S', 'C'];
let deck;

function createCard(value, suite) {
    let weight;

    if (/[0-9]/.test(value)) {
        weight = Number(value);
    } else if (value === 'A') {
        weight = 11;
    } else {
        weight = 10;
    }

    return {value, suite, weight};
}

function createDeck() {
    deck = [];
    for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < suite.length; j++) {
            deck.push(createCard(value[i], suite[j]));
        }
    }
}


// shuffling the deck function

function shuffleDeck() {
    for (i = 0; i < 1000; i++) {
        const card1 = Math.floor(Math.random() * 52);
        const card2 = Math.floor(Math.random() * 52);

        const tempCard = deck[card1];
        deck[card1] = deck[card2];
        deck[card2] = tempCard;
    }
}


// drawing card function, which returns a card as a <div> element
// records the weight of drawn card in addScore

let addScore;
let isAce;

function drawCard() {
    const newCard = deck.pop();
    const cardName = newCard.value + newCard.suite + '.png';
    addScore = newCard.weight;

    if (newCard.weight === 11){
        isAce = true;
    } else {
        isAce = false;
    }
    
    $('.remaining').text(deck.length);

    const newCardDiv = $('<div>');
    newCardDiv.addClass('card')
              .css('background-image', 'url(images/' + cardName + ')')

    return newCardDiv;
}


// dealing cards to player and dealer
// updating scores
// handles the special case of aces

let playerScore = 0;
let dealerScore = 0;

let playerAces = 0;
let dealerAces = 0

function dealToPlayer() {
    $('.player .card-table').append(drawCard());

    if (isAce) playerAces++;

    playerScore += addScore;

    if (playerScore > 21 && playerAces) {
        playerScore -= 10;
        playerAces--;
    } 
        
    $('.player .score').text(playerScore);

    if (playerScore >= 21) {
        playerStand();
    }
}

function dealToDealer() {
    $('.dealer .card-table').append(drawCard());

    if (isAce) dealerAces++;

    dealerScore += addScore;

    if (dealerScore > 21 && dealerAces) {
        dealerScore -= 10;
        dealerAces--;
    } 
        
    $('.dealer .score').text(dealerScore);
}


// dealing cards function to start the game

function dealCards() {
    dealToPlayer();
    dealToDealer();
    dealToPlayer();
    dealToDealer();
}


// starting the game, using Start/Restart button

$('#restart').on('click', startGame);

function startGame() {
    $('#restart').text('Restart');
    $('.card-table').empty();
    $('#stand').prop('disabled', false);
    $('#hit').prop('disabled', false);
    $('.winner').prop('hidden', true);

    playerAces = 0;
    dealerAces = 0;
    playerScore = 0;
    dealerScore = 0;
    $('.player .score').text(playerScore);
    $('.dealer .score').text(dealerScore);

    createDeck();
    shuffleDeck();
    dealCards();
}


// Hit button functionality

$('#hit').on('click', dealToPlayer);


// Stand button functionality

$('#stand').on('click', playerStand); 

function playerStand() {
    $('#stand').prop('disabled', true);
    $('#hit').prop('disabled', true);
    playDealer();
}


// dealer drawing cards until it gets to 17 (*dealer hits at soft 17)

function playDealer() {
    while (dealerScore <= 17) {
        if (dealerScore === 17 && !dealerAces) {
            break;
        }
        dealToDealer();
    }

    checkWinner();
}


// checking and announcing the winner

function checkWinner() {
    $('.winner').prop('hidden', false);

    if (playerScore > 21) {
        if (dealerScore > 21) {
            $('.winner').text('You both busted');
        } else {
            $('.winner').text('Dealer won');
        }
    } else if (dealerScore > 21) {
        $('.winner').text('You won!');
    } else if (playerScore > dealerScore) {
        $('.winner').text('You won!');
    } else if (dealerScore > playerScore) {
        $('.winner').text('Dealer won');
    } else {
        $('.winner').text('It\'s a draw');
    }

}

