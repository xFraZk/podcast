
        /* CONFIGURACIÓN DE ARCHIVOS */
        const tracks = [
            { 
                title: "1. Crónicas de Perfummia", 
                file: "audio/Villano_de_Perfummia_anatomía_de_un_marginado_ambicioso.m4a", 
                listeners: "5.2k" // Dato de oyentes simulado
            },
            
        ];

        let currentIdx = 0;
        let audioPlayer = new Audio(); 
        
        /* --- LÓGICA SEGUIR / FOLLOW --- */
        const followBtn = document.getElementById('followBtn');
        const followerCountEl = document.getElementById('followerCount');
        let isFollowing = false;
        let followerNum = 12400; // Base 12.4k

        followBtn.addEventListener('click', () => {
            isFollowing = !isFollowing;
            if(isFollowing) {
                followBtn.innerText = "Siguiendo";
                followBtn.classList.add('following');
                followerNum++;
            } else {
                followBtn.innerText = "Seguir";
                followBtn.classList.remove('following');
                followerNum--;
            }
            // Formato simple de número
            followerCountEl.innerText = (followerNum / 1000).toFixed(1) + 'k';
        });

        /* --- LÓGICA COMENTARIOS --- */
        const commentInput = document.getElementById('commentInput');
        const sendCommentBtn = document.getElementById('sendCommentBtn');
        const commentsList = document.getElementById('commentsList');

        function addComment() {
            const text = commentInput.value.trim();
            if(text === "") return;

            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `
                <span class="comment-user">@usuario_nuevo</span>
                <span class="comment-time">Ahora mismo</span>
                <span class="comment-text">${text}</span>
            `;
            // Añadir al principio
            commentsList.prepend(div);
            commentInput.value = "";
        }

        sendCommentBtn.addEventListener('click', addComment);
        commentInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') addComment();
        });


        /* --- DOM AUDIO ELEMENTS --- */
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn.querySelector('i');
        const visualizer = document.getElementById('visualizer');
        const progressFill = document.getElementById('progressFill');
        const progressContainer = document.getElementById('progressContainer');
        const currTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const trackTitle = document.getElementById('trackTitle');
        const listenerCountEl = document.getElementById('listenerCount');
        const playlistContainer = document.getElementById('playlistContainer');

        /* VISUALIZADOR */
        for(let i=0; i<40; i++){
            let bar = document.createElement('div');
            bar.className = 'bar';
            let randomHeight = Math.floor(Math.random() * 80 + 20);
            bar.style.height = randomHeight + '%';
            visualizer.appendChild(bar);
        }

        /* CARGAR TRACK */
        function loadTrack(idx) {
            currentIdx = idx;
            trackTitle.innerText = tracks[idx].title;
            listenerCountEl.innerText = tracks[idx].listeners; // Actualizar oyentes
            
            audioPlayer.src = tracks[idx].file;
            audioPlayer.load();

            progressFill.style.width = "0%";
            currTimeEl.innerText = "00:00";
            durationEl.innerText = "--:--";

            renderPlaylist();
            
            if(!audioPlayer.paused && audioPlayer.currentTime > 0) {
                playTrack();
            } else {
                updatePlayIcon(false);
            }
        }

        /* PLAYLIST */
        function renderPlaylist() {
            playlistContainer.innerHTML = '';
            tracks.forEach((t, idx) => {
                let div = document.createElement('div');
                div.className = `playlist-item ${idx === currentIdx ? 'active' : ''}`;
                div.onclick = () => {
                    if(idx !== currentIdx) {
                        loadTrack(idx);
                        playTrack(); 
                    }
                };
                div.innerHTML = `
                    <div class="pl-info">
                        <h4>${t.title}</h4>
                        <span>${idx === currentIdx ? 'Reproduciendo' : 'Episodio ' + (idx + 1)}</span>
                    </div>
                    <div class="pl-duration"><i class="fa-solid fa-play"></i></div>
                `;
                playlistContainer.appendChild(div);
            });
        }

        /* CONTROLES AUDIO */
        function togglePlay() {
            if (audioPlayer.paused) playTrack();
            else pauseTrack();
        }

        function playTrack() {
            audioPlayer.play();
            updatePlayIcon(true);
        }

        function pauseTrack() {
            audioPlayer.pause();
            updatePlayIcon(false);
        }

        function updatePlayIcon(isPlaying) {
            if(isPlaying) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        }

        /* EVENTOS AUDIO */
        audioPlayer.addEventListener('timeupdate', (e) => {
            const { duration, currentTime } = e.srcElement;
            if(isNaN(duration)) return;
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            currTimeEl.innerText = formatTime(currentTime);
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            durationEl.innerText = formatTime(audioPlayer.duration);
        });

        audioPlayer.addEventListener('ended', nextTrack);

        function formatTime(seconds) {
            let min = Math.floor(seconds / 60);
            let sec = Math.floor(seconds % 60);
            if(sec < 10) sec = `0${sec}`;
            return `${min}:${sec}`;
        }

        function nextTrack() {
            let next = (currentIdx + 1) % tracks.length;
            loadTrack(next);
            playTrack();
        }

        function prevTrack() {
            let prev = (currentIdx - 1 + tracks.length) % tracks.length;
            loadTrack(prev);
            playTrack();
        }

        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audioPlayer.duration;
            audioPlayer.currentTime = (clickX / width) * duration;
        });

        playBtn.addEventListener('click', togglePlay);
        document.getElementById('nextBtn').addEventListener('click', nextTrack);
        document.getElementById('prevBtn').addEventListener('click', prevTrack);

        /* INICIALIZAR */
        loadTrack(0);

