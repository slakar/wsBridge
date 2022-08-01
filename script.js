let socket = new WebSocket("ws://149.28.224.59:3000");

socket.onopen = function(e) {
    //document.getElementById("dash-loading-status").innerHTML = "Getting Data, please wait...";
    console.log('Getting data, please wait...');
    //setTimeout(function(){
        //socket.send("REQUEST_RF_DATA");
    //}, 1000);
};

socket.onmessage = function(event) {
    //console.log(`Data received: ${event.data}`);
    console.log(event.data);
    document.getElementById("status_valve").innerHTML = event.data;
};

socket.onclose = function(event) {
    alert('[close] Connection closed');
};

socket.onerror = function(error) {
    alert(`[error] ${error.message}`);
};

function send_value(){
    let val = 0;
    val = Number(document.getElementById("mins").value * 60) + Number(document.getElementById("secs").value);

    //console.log(val);
    socket.send(val);
}

function close_value(){
    socket.send(2);
}

