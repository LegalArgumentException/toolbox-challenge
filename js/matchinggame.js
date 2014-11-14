$(document).ready(function() {
	"use strict";
	createState();
	$("#gameHelp").popover();
	$("#newGame").on("click", function() {newGame()});
	$(window).on("resize", setImgWidths)
});

function createState() {
	//Object literal that keeps track of the game's state.
	window.gameState = {
		flipTimer : false,
		totalTime : 0,
		totalMatches : 0,
		pairsRemaining : 8,
		totalFailures : 0,
		totalTimer : null
	};
	window.gameState.totalTimer =  setInterval(function() {
		window.gameState.totalTime++;
		$("#time").html(window.gameState.totalTime);
	}, 1000);
	var randomImgIndex = _.shuffle(_.range(1, 33));
	var images = [];
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 2; j++) {
			var imgSource = './img/tile' + randomImgIndex[i] + ".jpg";
			var image = $('<img/>', {
				src: "./img/tile-back.png",
				alt: 'A picture used in a tile game',
				class: 'matchImage notPicked'
			});
			image.data("source", imgSource);
		 images.push(image);
		}
	}
	randomImgIndex = _.shuffle(_.range(16));
	for(var i = 0; i < 16; i++) {
		$("#row" + Math.floor(i/4)).append(images[randomImgIndex[i]]);
	}
	$(".notPicked").on("click", imgTest);
	setImgWidths();
}

function imgTest() {
	if(!window.gameState.flipTimer && $(this).hasClass("notPicked")) {
		$(this).removeClass("notPicked");
		$(this).addClass("picked");
		var picked = $(".picked");
		setImgWidths();
		$(this).attr("src", $(this).data("source"));
		if(picked.length == 2) {
			window.gameState.flipTimer = true;
			setTimeout(function() {pickedCheck(picked)}, 1000);
		}
	}
}

function pickedCheck(picked) {
	if(picked[0].src == picked[1].src) {
		picked.addClass("locked");
		picked.removeClass("picked");
		window.gameState.totalMatches += 1;
		window.gameState.pairsRemaining -= 1;
	} else {
		picked.toggleClass("notPicked");
		picked.toggleClass("picked");
		picked.attr("src", "./img/tile-back.png");
		window.gameState.totalFailures++;
	}
	setImgWidths();
	window.gameState.flipTimer = false;
	updateState();
}

function setImgWidths() {
	var limitingDimention = Math.min($(window).width(), $(window).height());
	$(".notPicked, .locked").width(Math.floor(limitingDimention * .19));
	$(".picked").width(Math.floor(limitingDimention * .21));
}

function updateState() {
	$("#total").html(window.gameState.totalMatches);
	$("#remaining").html(window.gameState.pairsRemaining);
	$("#failures").html(window.gameState.totalFailures);
	if(!window.gameState.pairsRemaining) {	
		alert("Winner!");
		clearInterval(window.gameState.totalTimer);
		winToggle();
		window.gameState.totalTimer = setInterval(winToggle, 10000);
	}
}

function newGame() {

	$("img").remove();
	clearInterval(window.gameState.totalTimer);
	createState();
	updateState();
}

function winToggle() {
	$(".matchImage").addClass("winState");
	setTimeout(function() {
		$(".matchImage").removeClass("winState");
	}, 5000);
}
