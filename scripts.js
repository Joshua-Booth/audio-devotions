/*
	Site Scripts
*/

var today = new Date();

var year = today.getFullYear();
var short_year = year.toString().slice(-2);
var month = today.getMonth() + 1;
var day = today.getDate();
var date = year + '-' + (month) + '-' + day

if (month < 10) {
    month = "0" + month;
}

if (day < 10) {
    day = "0" + day;
}

// Toggle between light and dark mode
function toggleColour() {
    var body = document.body;

    if (body.style.color == "white") {
        body.style.color = "black";
        body.style.backgroundColor = "white";
    }
    else {
        body.style.color = "white";
        body.style.backgroundColor = "black";
    }
}


var source_names = ["Charles Spurgeon - Morning", "Charles Spurgeon - Evening", "Word For Today", "Our Daily Bread", "Today in the Word"]

var sources = [`https://www.biblegateway.com/audio/devotional/morning-and-evening/${month}${day}m`, `https://www.biblegateway.com/audio/devotional/morning-and-evening/${month}${day}e`,
"https://vision.org.au/the-word-for-today/",
`https://dzxuyknqkmi1e.cloudfront.net/odb/${year}/${month}/odb-${month}-${day}-${short_year}.mp3`
,
"https://player.fm/series/today-in-the-word-devotional-1607977"];

var current_reading_index = 0;

var title = document.getElementById("title");

var audio = document.getElementsByTagName("audio")[0];

var playEle = document.getElementById("play");
var pauseEle = document.getElementById("pause");
var backward_button = document.getElementById("backward");
var forward_button = document.getElementById("forward");
var time_period = document.getElementById("time-period");
var morning = document.getElementById("morning");
var evening = document.getElementById("evening");

var sourceLink = "";

onload = function() {
	title.textContent = date.toString() + ": " + source_names[current_reading_index];
	update();

    console.log("Source: ", sourceLink);
    
    var flag = false;
    playEle.addEventListener('click', playDevotional);
    pauseEle.addEventListener('click', pauseDevotional);
    forward_button.addEventListener('click', stopDevotional);
    backward_button.addEventListener('click', stopDevotional);

    function playDevotional() {
        if (!(pauseEle.className == "paused")) {
            audio.src = sourceLink;
            audio.load();
        }
        console.log("Source: ", audio.src);
        
        var playPromise = audio.play();
        
      if (playPromise !== undefined) {
          playPromise.then(function () {
              console.log('Playing....');
          }).catch(function (error) {
              console.log('Failed to play....' + error);
          });
        }
        flag = false;
        playEle.className = pauseEle.className = '';
        forward_button.className = 'stopped';
        backward_button.className = 'stopped';
    }

    function pauseDevotional() {
        if (!audio.paused) { /* pause narration */
            pauseEle.className = 'paused';
            playEle.className = '';
            audio.pause();
        }
    }

    function stopDevotional() {
        if (audio.playing) { /* stop narration */
            /* for safari */
            forward_button.className = 'stopped';
            backward_button.className = 'stopped';
            playEle.className = pauseEle.className = '';
            flag = false;
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

function update() {
	if (current_reading_index < sources.length && current_reading_index > -1) {
		title.textContent = date.toString() + ": " + source_names[current_reading_index];      
        sourceLink  = getAudio();
        audio.src = sourceLink;
        console.log("Setting sourceLink to: ", sourceLink);
	}
	
	if (current_reading_index == 0) {
		backward_button.style = "visibility:hidden";
		backward_button.Enabled = false;
	}
	else {
		backward_button.style = "visibility:visible";
		backward_button.Enabled = true;
	}
	
	if (current_reading_index == sources.length - 1) {
		forward_button.style = "visibility:hidden";
		forward_button.Enabled = false;
	}
	else {
		forward_button.style = "visibility:visible";
		forward_button.Enabled = true;
	}
}


function getAudio() {
    var index = current_reading_index;
    var source = "";
    var url = "https://cors-anywhere.herokuapp.com/" + sources[index];

    function getSiteData (url) {
        return (fetch(url, {
          mode: 'cors',
          headers: [
            ['Access-Control-Allow-Origin', '*'],
            ['Access-Control-Expose-Headers', '*'],
            ["Access-Control-Allow-Credentials", "true"],
            ["Access-Control-Allow-Methods", "GET"],
            ['x-requested-with', 'XMLHttpRequest'],
            ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"],
          ]
        })
        .then(function(response) {return response.text()})
         .then(function(data) {
            var html = data;
            var div = document.createElement("div");
            div.innerHTML = html;

            // Charles Spurgeon : Morning and Evening
            if (index == 0) {
                var source_audio = div.getElementsByTagName("source")[0]
                source = source_audio.src.toString();
            }
            else if (index == 1) {
                var source_audio = div.getElementsByTagName("source")[0]
                source = source_audio.src.toString();
            }
            // Word For Today
            else if (index == 2) {
                var source_audio = div.getElementsByTagName("audio")[0]
                source = source_audio.src.toString();
            }
            // Our Daily Bread
            else if (index == 3) {
                source = sources[3];
                console.log(source);
            }
            // Today in the Word
            else if (index == 4) {
                var source_audio = div.getElementsByClassName("play-prompt playable button")[0];
                source = source_audio.href.toString();
            }
            else {
                source = null;
            }
            sourceLink = source;
            return source;
        })
        .catch(function(error) {
            console.log(error);
        }));
    }
	return getSiteData(url).data;
}

// Skip forward to the next devotional
function forward() {
	if ((current_reading_index < sources.length && current_reading_index + 1  != sources.length) || current_reading_index < 0) {
		current_reading_index += 1;
		update();
	}
	else {
		forward_button.style = "visibility:hidden";
		forward_button.Enabled = false;
		backward_button.style = "visibility:visible";
		backward_button.Enabled = true;
	}
}

// Skip backward to the previous devotional
function backward() {
	if ((current_reading_index > sources.length && current_reading_index != sources.length) || current_reading_index > 0) {
		current_reading_index -= 1;
		update();
	}
	else {
		forward_button.style = "visibility:visible";
		forward_button.Enabled = true;
		backward_button.style = "visibility:hidden";
		backward_button.Enabled = false;
	}
}
