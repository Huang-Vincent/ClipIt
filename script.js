var connection = new WebSocket('ws://34.74.119.87:9995');
connection.onopen = function () {
  connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
  window.times = e.data.split();
  showVideo();
};

//Add fade in animations
$( document ).ready(function() {
    $("#input").delay(700).animate({"opacity": "1"}, 800);
    $("#desc").delay(800).animate({"opacity": "1"}, 800);
});

//if given improper url
function urlError() {
    if($("#errorMsg").length == 0) {
        let p = document.createElement("p");
        let text = document.createTextNode("Incorrect URL");
        p.setAttribute("id","errorMsg")
        p.style.opacity = 1;
        p.style.color = "red";
        p.appendChild(text);
        $("#urlBox").prepend(p);
    }
}

//get the url
function getData() {
    let url = document.getElementById("clip_url").value;

    if(!url.includes("twitch.tv/videos/")) {
        urlError();
        return;
    }

    window.urlId = url.split('videos/')[1];

    //send this url
    // while(!(connection.readyState == connection.OPEN)) {
    // }
    //connection.send(String(urlId));

    $("#input").delay(100).animate({"opacity": "0"}, 500);
    $("#desc").delay(100).animate({"opacity": "0"}, 500);


//     <div class="spinner-border text-primary" role="status">
//   <span class="sr-only">Loading...</span>
// </div>

    // let div = document.createElement("div");
    // div.setAttribute("class", "spinner-border text-primary text-center");
    // div.setAttribute("role", "spinner-border text-primary");
    // let span = document.createElement("span");

    setTimeout(function(){
        document.getElementById("input").remove();
        document.getElementById("desc").remove();
    }, 650);
}

//go to that timestamp
function toTime(str) {
    iframe.setAttribute("src", "https://player.twitch.tv/?video=v" + String(urlId) + "&time=" + str);
}

//refresh the page to clip it again
function reclip() {
    window.location.reload(false);
}

//load video and buttons
function showVideo() {
    let rowDiv;
    let colDiv;
    let button;
    let div;
    let text;
    let h3;

    //create new div for buttons
    div = document.createElement("div");
    div.setAttribute("class", "container");
    div.style.paddingBottom = "52px";

    //get the times
    //window.times = ["01h30m42s", "02h40m22s", "03h25m03s"];
    let counter = 0;
    let str;

    for(let x = 0; x < Math.ceil(times.length/5); x++) {
        rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row");
        rowDiv.style.paddingTop = "25px";
        div.appendChild(rowDiv);

        for(let y = 0; y < 5 && counter<times.length; y++) {
            colDiv = document.createElement("div");
            colDiv.setAttribute("class", "col text-center");

            str = times[counter].replace(/[a-r]/g, ':');
            str = str.replace('s', "");

            button = document.createElement("button");
            button.setAttribute("class", "btn btn-primary btn-lg clipit-button");
            button.setAttribute("onclick", "toTime(\""+times[counter]+"\")");
            button.setAttribute("id", "timestamp");
            button.style.opacity = 0;


            rowDiv.appendChild(colDiv);
            colDiv.appendChild(button);

            text = document.createTextNode(str);
            button.appendChild(text);

            counter++;
            colDiv = document.createElement("div");
            colDiv.setAttribute("class", "col text-center");
        }
        rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row");
        rowDiv.style.paddingTop = "25px";
    }

    $("footer").prepend(div);
    $("button").delay(300).animate({"opacity": "1"}, 800);

    //create new div for the highlights
    div = document.createElement("div");
    div.setAttribute("class", "row justify-content-center");
    div.style.paddingTop = "25px";
    div.style.paddingLeft = "25px";
    div.style.paddingRight = "25px";

    h3 = document.createElement('h3');
    text = document.createTextNode("Highlights");
    h3.setAttribute("class", "display-7 text-dark text-center font-weight-normal");

    h3.appendChild(text);
    div.appendChild(h3);
    $("footer").prepend(div);

    //create new div
    div = document.createElement("div");
    div.setAttribute("class", "row justify-content-center");
    div.setAttribute("id", "vidPlayer");
    div.style.paddingTop = "25px";
    div.style.paddingLeft = "25px";
    div.style.paddingRight = "25px";
    div.style.opacity = 0;

    //create the iframe
    window.iframe = document.createElement('iframe');
    iframe.setAttribute("src", "https://player.twitch.tv/?video=v" + String(urlId) + "&time=0h0m0s");
    iframe.setAttribute("height", "450");
    iframe.setAttribute("width", "800");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowfullscreen", "true");

    div.appendChild(iframe);
    $("footer").prepend(div);
    $("#vidPlayer").delay(100).animate({"opacity": "1"}, 500);

    button = document.createElement("button");
    button.setAttribute("class", "btn btn-primary btn-lg");
    button.setAttribute("onclick", "reclip()");
    button.setAttribute("id", "reclip");
    text = document.createTextNode("ReClip!");
    button.style.opacity = 1;
    button.append(text);

    $("#topDec").append(button);
}
