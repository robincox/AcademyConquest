var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

$(document).ready(function(){
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/gameRoom', function (greeting) {
            updateGame(JSON.parse(greeting.body).content);
        });
    });
});

/*
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}
*/

function sendGameTurnData() {
    stompClient.send("/app/endTurn", {}, JSON.stringify({'name': $("#name").val()}));
}

function updateGame(message) {
    //Vi splittar upp informationen för att kunna skriva värden på olika ställen
    var countryContent = message.split("!1");
    $("#CountryName").html(countryContent[0]);
    $("#CountryValues").html(countryContent[1]);
    $(".adjacent").removeClass("adjacent");
    $(".chosen").removeClass("chosen");
    $(".others").removeClass("others");
    for(var i=2; i<countryContent.length-1; i++){
        $("#" + countryContent[i] + " > g > a > path").addClass("adjacent");
    }
    $("#" + countryContent[countryContent.length-1] + " > g > a > path").addClass("chosen");
    $("path:not(.adjacent):not(.chosen)").addClass("others");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#endTurn" ).click(function() { sendGameTurnData(); });
});