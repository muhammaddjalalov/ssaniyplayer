    const buttons = document.querySelectorAll(".play-btn");
    const player = document.getElementById("main-audio");
    const nowPlaying = document.getElementById("now-playing");
    const trackCards = Array.from(document.querySelectorAll(".track-card"));
    const trackSources = trackCards.map(card => card.querySelector("source").src);
    let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;
    buttons.forEach((button, idx) => {
        button.addEventListener("click", ()=> {
            const card = button.closest(".track-card");
            const audio = card.querySelector("audio");
            const audioSrc = card.querySelector("source").src;
            const title = card.querySelector(".track-title").textContent;
            if (currentIndex === idx) {
                if (player.paused) {
                    player.play();
                } else {
                    player.pause();
                }
                return;
            }
            player.src = audioSrc;
            progressBar.value = 0;
            nowPlaying.textContent = title;
            player.play();
            currentIndex = idx;
            highlightCurrentTrack();
            localStorage.setItem("currentIndex", currentIndex);
            localStorage.setItem("currentTrack", audioSrc);
            localStorage.setItem("currentTitle", title);
            localStorage.setItem("isPaused", "false");
        });
    });
    const currentTimeEl = document.getElementById("current-time");
    const totalTimeEl = document.getElementById("total-time");
    player.addEventListener("loadedmetadata", () => {
        let total = Math.floor(player.duration);
        let minutes = Math.floor(total/60);
        let seconds = total % 60;
        if(seconds < 10) seconds = "0" + seconds;
        totalTimeEl.textContent = minutes + ":" + seconds;
    });
    document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".track-card").forEach(card => {
        const audio = card.querySelector("audio");
        const durationEl = card.querySelector(".track-duration");
        audio.addEventListener("loadedmetadata", () => {
            let total = Math.floor(audio.duration);
            let minutes = Math.floor(total/60);
            let seconds = total % 60;
            if(seconds < 10) seconds = "0" + seconds;
            durationEl.textContent = minutes + ":" + seconds;
        });
    });
    });
    window.addEventListener("load", () => {
        const savedTrack = localStorage.getItem("currentTrack");
        const savedTitle = localStorage.getItem("currentTitle");
        const savedTime = localStorage.getItem("currentTime");
        const wasPaused = localStorage.getItem("isPaused");
           if(savedTrack){
            player.src = savedTrack;
            nowPlaying.textContent = savedTitle;
            player.addEventListener("ended", ()=> {
                if(repeatMode === 2){
                    player.currentTime = 0;
                    player.play();
                    return
                }
                currentIndex++;
                if (currentIndex >=trackSources.length){
                    if(repeatMode === 1){
                        currentIndex = 0;
                    } else {
                        return;
                    }
                }
                player.src = trackSources[currentIndex];
                nowPlaying.textContent =
                    trackCards[currentIndex].querySelector(".track-title").textContent;
                player.play();
                if (currentIndex >= trackSources.length) currentIndex = 0;
                highlightCurrentTrack();
                player.src = trackSources[currentIndex];
                nowPlaying.textContent = trackCards[currentIndex].querySelector(".track-title").textContent;
                player.play();
                localStorage.setItem("currentIndex", currentIndex);
                localStorage.setItem("currentTrack", trackSources[currentIndex]);
                localStorage.setItem("currentTitle", nowPlaying.textContent);
            });
            player.addEventListener("loadedmetadata", () => {
                if (savedTime) player.currentTime = Number(savedTime);
                if (wasPaused !=="true") { 
                player.play();
                }
            }, {once: true});
        };
    });
let repeatMode = 0;
const repeatBtn = document.getElementById("repeat");
repeatBtn.addEventListener("click", () => {
    repeatMode++;
    if(repeatMode > 2){
        repeatMode = 0;
    }
    updateRepeatIcon();
});
function updateRepeatIcon(){
    if(repeatMode === 0){
        repeatBtn.textContent = "⤵";
    }
    if(repeatMode === 1){
        repeatBtn.textContent = "↶";
    }
    if(repeatMode === 2){
        repeatBtn.textContent = "⟲";
    }
}
const playPauseBtn = document.getElementById("play-pause");
playPauseBtn.onclick = () => {
    if (player.paused) {
        player.play();
        playPauseBtn.textContent = "⏸︎";
    } else {
        player.pause();
        playPauseBtn.textContent = "▶︎";
    }
};
const progressBar = document.getElementById("progress-bar");
player.addEventListener("timeupdate", () => {
    let current = Math.floor(player.currentTime);
    let minutes = Math.floor(current / 60);
    let seconds = current % 60;
    if (seconds < 10) seconds="0" + seconds;
    currentTimeEl.textContent = minutes +":" + seconds;
    const percent = (player.currentTime / player.duration) * 100;
    progressBar.value = percent;
    progressBar.style.background = `linear-gradient(to right, var(--color-main) ${percent}%, var(--color-dark) ${percent}%)`;
});
progressBar.addEventListener("input", () => {
    const time = (progressBar.value / 100) * player.duration;
    player.currentTime = time;
});
    document.getElementById("next").onclick = () => {
        currentIndex++;
        if(currentIndex >= trackSources.length) currentIndex = 0;
        highlightCurrentTrack();
        player.src = trackSources[currentIndex];
        nowPlaying.textContent = trackCards[currentIndex].querySelector(".track-title").textContent;
        player.play();
        localStorage.setItem("currentIndex", currentIndex);
        localStorage.setItem("currentTrack", trackSources[currentIndex]);
        localStorage.setItem("currentTitle", nowPlaying.textContent);
    };
    document.getElementById("prev").onclick = () => {
        currentIndex--;
        if(currentIndex <0) currentIndex = trackSources.length - 1;
        highlightCurrentTrack();
        player.src = trackSources[currentIndex];
        nowPlaying.textContent = trackCards[currentIndex].querySelector(".track-title").textContent;
        player.play();
        localStorage.setItem("currentIndex", currentIndex);
        localStorage.setItem("currentTrack", trackSources[currentIndex]);
        localStorage.setItem("currentTitle", nowPlaying.textContent);
    };
    player.addEventListener("timeupdate", () => {
        localStorage.setItem("currentTime", player.currentTime);
    })
    player.addEventListener("pause", () => {
        localStorage.setItem("isPaused", "true");
    })
    player.addEventListener("play", () => {
        localStorage.setItem("isPaused", "false");
    })
    function highlightCurrentTrack() {
        trackCards.forEach((card, idx) => {
            card.classList.toggle("active", idx === currentIndex);
        });
    }
    highlightCurrentTrack();
    window.addEventListener("DOMContentLoaded", () => {
        const albumInfo = document.querySelector(".album-info p");
        let totalDuration = 0;
        trackCards.forEach(card => {
            const audio = card.querySelector("audio");
            audio.addEventListener("loadedmetadata", () => {
                totalDuration += audio.duration;
                const minutes = Math.floor(totalDuration / 60);
                const seconds = Math.floor(totalDuration % 60).toString().padStart(2, '0');
                albumInfo.textContent = `${trackCards.length} треков - ${minutes} мин. ${seconds} сек.`;
            });
        });
    });
