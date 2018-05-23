let deckOfCards = [];
let deckOfCardsHTML = [];
let flippedCards = [];
let flippedCardsIndex = [];
let numberOfFlipped = 0;
let numberOfMoves = 0;
let numberOfPairs = 0;
let timer;
let sec = 0;
let seconds = 0;
let minutes = 0;


//Shuffles card order on page load
$(document).ready(function() {
	deckOfCards = $(".card").toArray();
	for (let a = 0; a < deckOfCards.length; a++) {
		deckOfCardsHTML[a] = deckOfCards[a].outerHTML;
		shuffleDeck(deckOfCardsHTML);
	}
})

$("#start").click(function(){
	$("#timer").css("display","inline");
	$(".seconds").html("00");
	$(".minutes").html("00");
	function pad ( val ) { return val > 9 ? val : "0" + val; }
	timer = setInterval( function(){
		seconds = pad(++sec%60)
		minutes = pad(parseInt(sec/60,10))
	    $(".seconds").html(seconds);
		$(".minutes").html(minutes);
	}, 1000);
	$("#start").css("display","none");
	$(".hide").css("display","none");
})


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

//Shuffles deck array and inserts new card order in HTML
let shuffleDeck = function(array) {
	shuffle(deckOfCardsHTML);
	$(".deck").empty();
	for (let x = 0; x < deckOfCardsHTML.length; x++) {
		$(".deck").append(deckOfCardsHTML[x]);
	};
	$(".card").click(clickFlip);
}

let match = function() {
	$(".card:nth-child("+(flippedCardsIndex[0]+1)+")").addClass("match");
	$(".card:nth-child("+(flippedCardsIndex[1]+1)+")").addClass("match");
	numberOfPairs += 1;
	flippedCards = [];
	flippedCardsIndex = [];
	numberOfFlipped = 0;
}

let notMatch = function() {
	$(".card:nth-child("+(flippedCardsIndex[0]+1)+")").removeClass("open");
	$(".card:nth-child("+(flippedCardsIndex[1]+1)+")").removeClass("open");
	flippedCards.splice(0,2);
	flippedCardsIndex.splice(0,2);
	numberOfFlipped = 1;
}

//When all cards are matched, add content to modal and display stats
let allMatched = function() {
	if (numberOfPairs === (deckOfCardsHTML.length/2)) {
		clearTimeout(timer);
		$(".modalContent").empty();
		$(".modalContent").prepend(`<span id="finishedText">You finished in ${minutes}:${seconds} and ${numberOfMoves} moves!</span>`);
		$(".stars").clone().prependTo($(".modalContent"));
		$(".modalContent").children(".stars").addClass("endStars").removeClass("stars");
		$(".modalContent").prepend("<span id=\"close\">&times;</span>")
		$(".modalContent").append("<button id = \"playAgain\">Play Again?</button>")
		$(".modal").css("display", "block");

		$("#playAgain").click(function(){
			$(".modal").css("display", "none");
			restartFunction();
		})

		$("#close").click(function(){
		$(".modal").css("display", "none");
		})
	};
}

//Only activates on non-open cards. Checks for a match and updates number of moves for every pair attempt
let clickFlip = function(event){
	if (!$(this).hasClass("open")) {
		$(this).addClass("open");
		numberOfFlipped += 1;
		flippedCards.push(event.currentTarget.children[0].outerHTML);
		flippedCardsIndex.push($(".card").index(this));
			if (numberOfFlipped === 2) {
				numberOfMoves += 1;
				if (flippedCards[0] === flippedCards[1]) {
					match();
				};
				starScore();
			};
			if (numberOfFlipped === 3) {
				notMatch();
			};

		$(".moves").empty();
		$(".moves").append(numberOfMoves);
		allMatched();
	};
}

//Update score based on how many moves it takes to finish game.  Replaces stars with hollow stars over time
let starScore = function(){
	if (numberOfMoves === 0) {
		$(".stars").empty().append(`<li class="starList"><i class="star fa fa-star"></i></li> <li class="starList"><i class="star fa fa-star"></i></li> <li class="starList"><i class="star fa fa-star"></i></li>`);
	};
	if (numberOfMoves === 15) {
		$(".stars").children("li").first().remove();
		$(".stars").append(" " + "<li class=\"starList\"><i class=\"star fa fa-star-o\"></i></li>");
	};
	if (numberOfMoves === 20) {
		$(".stars").children("li").first().remove();
		$(".stars").append(" " + "<li class=\"starList\"><i class=\"star fa fa-star-o\"></i></li>");
	};
	if (numberOfMoves === 25) {
		$(".stars").children("li").first().remove();
		$(".stars").append(" " + "<li class=\"starList\"><i class=\"star fa fa-star-o\"></i></li>");
	};
}

//Reset entire board, score, and timer
let restartFunction = function(){
	shuffleDeck();
	numberOfMoves = 0;
	numberOfPairs = 0;
	numberOfFlipped = 0;
	flippedCards = [];
	flippedCardsIndex = [];
	$(".moves").empty().append(numberOfMoves);
	starScore();
	clearTimeout(timer);
	$(".seconds").html("00");
	$(".minutes").html("00");
	sec = 0;
	$("#start").css("display","block");
}

$(".restart").click(restartFunction);
