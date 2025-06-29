console.log("Hello")
let currentSong = new Audio();
// let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playmusic = (track) => {
    currentSong.src = `/songs/` + track
    currentSong.play()
    play.src = "assets/images/pause.svg"
    // let audio = new Audio("/songs/" + track)
    // audio.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    let songs = await getsongs()
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="https://cdn.hugeicons.com/icons/music-note-03-stroke-rounded.svg" alt="music-note-03" width="24" height="24" />
        <div class="info">
        <div class="song"> ${song.replaceAll("%20", " ").replaceAll("%2C", ",").replace("%5B", "[").replace("%5D", "]")}</div>
    </div>
    <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="https://cdn.hugeicons.com/icons/play-circle-stroke-rounded.svg" alt="play-circle" width="24" height="24" />
    </div> </li>`;
    }

    // var audio = new Audio(songs[0]);
    // audio.play();
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            // playmusic(e.querySelector("info"))
            // console.log("hi")
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // play.addEventListener("click," ()=>{
    //     // if (currentSong.paused) {
    //     //     currentSong.play()
    //     //     play.src ="pause.svg"

    //     // } 
    //     // else {
    //     //     currentSong.pause()   
    //     // }
    // })
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/images/play.svg"
        }/*  */
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    // document.querySelector(".seekbar").addEventListener("click", e=>{
    //     let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    //     document.querySelector(".circle").style.left = percent  + "%";
    //     currentSong.currentTime = (currentSong.duration)*percent/100
    // })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    }) 
    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

}

main()