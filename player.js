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
            player.src = audioSrc;
            nowPlaying.textContent =title;
            player.play();
            currentIndex = idx;
            localStorage.setItem("currentIndex", currentIndex);
            localStorage.setItem("currentTrack", src);
            localStorage.setItem("currentTitle", title);
            localStorage.setItem("isPaused", "false");
        });
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
                currentIndex++;
                if (currentIndex >= trackSources.length) currentIndex = 0;
                player.src = trackSources[currentIndex];
                nowPlaying.textContent = trackCards[currentIndex].querySelector(".track-title").textContent;
                player.play();
                localStorage.setItem("currentIndex", currentIndex);
            });
            player.addEventListener("loadedmetadata", () => {
                if (savedTime) player.currentTime = Number(savedTime);
                if (wasPaused !=="true") { 
                player.play();
                }
            }, {once: true});
        }
    });
    document.getElementById("next").onclick = () => {
        currentIndex++;
        if(currentIndex >= trackSources.length) currentIndex = 0;
        player.src = trackSources[currentIndex];
        nowPlaying.textContent = trackCards[currentIndex].querySelector(".track-title").textContent;
        player.play();
        localStorage.setItem("currentIndex", currentIndex);
    };
    document.getElementById("prev").onclick = () => {
        currentIndex--;
        if(currentIndex <0) currentIndex = trackSources.length - 1;
        player.src = trackSources[currentIndex];
        nowPlaying.textContent = trackCards[currentIndex].querySelector(".track-title").textContent;
        player.play();
        localStorage.setItem("currentIndex", currentIndex);
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
    currentIndex = idx;
    highlightCurrentTrack();
    window.addEventListener("DOMContentLoaded", () => {
        const albumInfo = document.querySelector(".album-info p");
        let totalDuration = 0;
        trackCards.forEach(card => {
            const audio = card.querySelector("audio");
            audio.addEventListener("loadedmetadata", () => {
                totalDuration += audio.Duration;
                const minutes = Math.floor(totalDuration / 60);
                const seconds = Math.floor(totalDuration % 60).toString().padStart(2, '0');
                albumInfo.textContent = `${trackCards.lenght} треков - ${minutes}:${seconds} минут`;
            });
        });
    });
