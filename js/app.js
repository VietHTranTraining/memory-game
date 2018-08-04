/*
 * Create a list that holds all of your cards
 */

// Storing unique icon names
const ICONS = [
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb'
]
let isGameOver = false;
let currentStatus = 0; // 0: first select; 1: second select; 2: standby
let currentScore = 0;
let firstSelect = null;
let secondSelect = null;
let moves = 0;
let starRating = 3;
let startTime = 0;
const movesElem = document.getElementById('moves');
const popupElem = document.getElementById('popup');
const starsDisplay = document.getElementById('stars-display');
const totalStars = document.getElementById('total-stars');
const totalMoves = document.getElementById('total-moves');
const totalTime = document.getElementById('total-time');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Check if game is over
function checkGameOver() {
    isGameOver = (currentScore === ICONS.length);
    return isGameOver;
}

// End game
function endGame() {
    let endTime = performance.now();
    let gameDuration = (endTime - startTime) / 1000;
    totalStars.textContent = starRating;
    totalMoves.textContent = moves;
    totalTime.textContent = gameDuration;
    popupElem.setAttribute('class', 'game-over');
}

// Remove all child elements
function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Hide selected cards when not matched
function hideSelection() {
    firstSelect.setAttribute('class', 'card');
    secondSelect.setAttribute('class', 'card');
    currentStatus = 0;
}

// Hide specific star display (1: second star; 2: third star)
function hideStarDisplay(index) {
    if (index < 1 || index > 2) {
        console.log('Error: Invalid star display index');
        return;
    }
    let children = starsDisplay.children;
    for (let i = 0; i < children.length; ++i) {
        if (i === index) {
            children[i].firstChild.setAttribute('class', 'fa fa-star hidden');
            break;
        }
    }
}

// Update the status of current star rating based on the number of moves
// Less or equal 17 moves: 3 stars
// From 18 to 25 moves: 2 stars
// More than 25 moves: 1 stars
function updateStarRating() {
    if ((moves > 25 && starRating == 2) ||
        (moves > 17 && moves <= 25 && starRating == 3)) {
        --starRating;
        hideStarDisplay(starRating);
    }
    console.log(starRating);
}

// Check if the two selections are a match
function validateSelection() {
    if (firstSelect == null || secondSelect == null) {
        console.log('Error: null selection');
        return;
    }
    // Get selected element's icons
    firstIcon = firstSelect.firstChild;
    secondIcon = secondSelect.firstChild;
    // Get selected element's icon's classes
    firstClassList = firstIcon.classList;
    secondClassList = secondIcon.classList;
    firstIconIndex = -1;
    secondIconIndex = -1;
    for (let i = 0 ; i < firstClassList.length; ++i) {
        let className = firstClassList[i];
        if (className.length < 4) {
            continue;
        }
        firstIconIndex = ICONS.indexOf(className.slice(3));
        if (firstIconIndex !== -1) {
            break
        }
    }
    for (let i = 0 ; i < secondClassList.length; ++i) {
        let className = secondClassList[i];
        if (className.length < 4) {
            continue;
        }
        secondIconIndex = ICONS.indexOf(className.slice(3));
        if (secondIconIndex !== -1) {
            break
        }
    }
    // Check if both card icon share the same index in ICONS array
    if (firstIconIndex !== secondIconIndex) {
        firstSelect.setAttribute('class', 'card not-match');
        secondSelect.setAttribute('class', 'card not-match');
        setTimeout(hideSelection, 500);
    } else {
        firstSelect.setAttribute('class', 'card match');
        secondSelect.setAttribute('class', 'card match');
        ++currentScore;
        if (checkGameOver()) {
            endGame();
        } else {
            currentStatus = 0;
        }
    }
}

// Flip selected card
function flipCard(evt) {
    elem = evt.target;
    // If target is an icon get its parent which is a list item
    if (elem.nodeName === 'I') {
        elem = elem.parentElement;
    }
    // If game is over, element is not list item, status is standby
    // card is already shown or matched, then click doesn't do anything
    if (elem.nodeName !== 'LI' ||
        currentStatus === 2 ||
        elem.classList.contains('show') ||
        elem.classList.contains('match') ||
        isGameOver) {
        return;
    } else if (currentStatus === 0) {
        // First card selected
        firstSelect = elem;
        elem.setAttribute('class', 'card open show');
        ++currentStatus;
    } else if (currentStatus === 1) {
        // Second card selected
        secondSelect = elem;
        ++currentStatus;
        ++moves;
        movesElem.textContent = moves;
        updateStarRating();
        validateSelection();
    }
}

// Generate random card table
function shuffleCards() {
    // Number of cards are twice the number of icons
    let cards = ICONS.concat(ICONS.slice());
    // Randomly arrange cards
    cards = shuffle(cards);

    // Display cards on deck
    cardElems = document.querySelectorAll('.card');
    for (let i = 0; i < cardElems.length; ++i) {
        cardElem = cardElems[i];
        let newIcon = document.createElement('I');
        emptyElement(cardElem);
        cardElem.setAttribute('class', 'card')
        newIcon.setAttribute('class', 'fa fa-' + cards[i]);
        cardElem.appendChild(newIcon);
    }
}

// Initialize star display
function initStarsDisplay() {
    starRating = 3;
    let children = starsDisplay.children;
    // Make all star icons visible
    for (let i = 0; i < children.length; ++i) {
        children[i].firstChild.classList.remove('hidden');
    }
}

// Initialize game
function initGame() {
    moves = 0;
    currentScore = 0;
    isGameOver = false;
    currentStatus = 0;
    firstSelect = null;
    secondSelect = null;
    movesElem.textContent = moves;
    popupElem.setAttribute('class', '');
    initStarsDisplay();
    shuffleCards();
    deck = document.getElementById('deck');
    deck.addEventListener('click', flipCard);
    startTime = performance.now();
}

initGame();
// Call initGame whenever replay or restart button is clicked
document.getElementById('restart-btn').addEventListener('click', initGame);
document.getElementById('replay-btn').addEventListener('click', initGame);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
