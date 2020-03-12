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
    $("#answer").html("");
}

function connect() {
    // https://chatbot-intelligent-cat.cfdev01-tx-a.iteclientsys.local
    var socket = new SockJS('https://chatbot-intelligent-cat.cfdev01-tx-a.iteclientsys.local/chatbot'); // stomp endpoint
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/answers', function (answer) {
            console.log('/topic/answer:', JSON.parse(answer.body).content);
            showAnswer(JSON.parse(answer.body).content);
        });

        stompClient.subscribe('/topic/audit', function (audit) {
            console.log('/topic/audit:', audit.body);
        });

        stompClient.subscribe('/app/server-time', function (time) {
            console.log('/app/server-time:', time.body);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendQuestion() {
    stompClient.send("/app/ask", {}, JSON.stringify({ 'content': $("#question").val() }));
}

function showAnswer(message) {
    $("#answer").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () { connect(); });
    $("#disconnect").click(function () { disconnect(); });
    $("#send").click(function () { sendQuestion(); });
});