document.addEventListener('DOMContentLoaded', async () => {
    let data;

    // Threat Level Priority (SSS+++ first, G- last)
    const threatOrder = [
        "SSS+++", "SSS++", "SSS+", "SSS", "SSS-",
        "SS+++", "SS++", "SS+", "SS", "SS-",
        "S+++", "S++", "S+", "S", "S-",
        "A+++", "A++", "A+", "A", "A-",
        "B+++", "B++", "B+", "B", "B-",
        "C+++", "C++", "C+", "C", "C-",
        "D+++", "D++", "D+", "D", "D-",
        "E+++", "E++", "E+", "E", "E-",
        "F+++", "F++", "F+", "F", "F-",
        "G+++", "G++", "G+", "G", "G-"
    ];

    // Load Data
    try {
        const response = await fetch('data/data.json');
        data = await response.json();
    } catch (error) {
        showError('Failed to load codex data. Please try again later.');
        return;
    }

    // Initialize Filters
    populateFilters(data.continents);
    renderCards(data.beasts);

    // Event Listeners
    document.getElementById('search').addEventListener('input', debounce(searchBeasts, 300));
    document.getElementById('continent-filter').addEventListener('change', searchBeasts);

    // Search Functionality
    function searchBeasts() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const continent = document.getElementById('continent-filter').value;

        const results = data.beasts.filter(beast => {
            const matchesSearch = beast.name.toLowerCase().includes(searchTerm) ||
                beast.description.toLowerCase().includes(searchTerm);
            const matchesContinent = continent ? beast.continentId === continent : true;
            return matchesSearch && matchesContinent;
        });

        // Sort by threat level (SSS+++ first, G- last)
        results.sort((a, b) => {
            return threatOrder.indexOf(a.threatLevel) - threatOrder.indexOf(b.threatLevel);
        });

        renderCards(results);
    }

    // Render Cards
    function renderCards(beasts) {
        const container = document.getElementById('card-container');
        container.innerHTML = beasts.map(beast => {
            const threatClass = getThreatClass(beast.threatLevel);
            return `
                <div class="card">
                    <div class="card-image" style="background-image: url(${beast.image})">
                        <span class="threat-level ${threatClass}">${beast.threatLevel}</span>
                    </div>
                    <div class="image-popup">
                        <span class="close-btn">&times;</span>
                        <img src="${beast.image}" alt="${beast.name}">
                    </div>
                    <div class="card-content">
                        <h2>${beast.name}</h2>
                        <p>${beast.description}</p>
                        <div class="stats">
                            <div>
                                <h3>Strengths</h3>
                                <ul>${beast.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
                            </div>
                            <div>
                                <h3>Weaknesses</h3>
                                <ul>${Array.isArray(beast.weaknesses) ? beast.weaknesses.map(w => `<li>${w}</li>`).join('') : beast.weaknesses}</ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Reattach event listeners for the image popups
        attachPopupListeners();
    }

    // Function to attach popup listeners
    function attachPopupListeners() {
        document.querySelectorAll('.card-image').forEach(image => {
            image.addEventListener('click', (e) => {
                const popup = image.closest('.card').querySelector('.image-popup');
                popup.classList.add('active');
            });
        });

        document.querySelectorAll('.image-popup').forEach(popup => {
            // Close on X button
            popup.querySelector('.close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                popup.classList.remove('active');
            });

            // Close on background click
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.classList.remove('active');
                }
            });
        });
    }

    function getThreatClass(threatLevel) {
        switch (threatLevel) {
            case "SSS+++": return "sss3plus";
            case "SSS++": return "sss2plus";
            case "SSS+": return "sssplus";
            case "SSS": return "sss";
            case "SSS-": return "sssminus";
            case "SS+++": return "ss3plus";
            case "SS++": return "ss2plus";
            case "SS+": return "ssplus";
            case "SS": return "ss";
            case "SS-": return "ssminus";
            case "S+++": return "s3plus";
            case "S++": return "s2plus";
            case "S+": return "splus";
            case "S": return "s";
            case "S-": return "sminus";
            case "A+++": return "a3plus";
            case "A++": return "a2plus";
            case "A+": return "aplus";
            case "A": return "a";
            case "A-": return "aminus";
            case "B+++": return "b3plus";
            case "B++": return "b2plus";
            case "B+": return "bplus";
            case "B": return "b";
            case "B-": return "bminus";
            case "C+++": return "c3plus";
            case "C++": return "c2plus";
            case "C+": return "cplus";
            case "C": return "c";
            case "C-": return "cminus";
            case "D+++": return "d3plus";
            case "D++": return "d2plus";
            case "D+": return "dplus";
            case "D": return "d";
            case "D-": return "dminus";
            case "E+++": return "e3plus";
            case "E++": return "e2plus";
            case "E+": return "eplus";
            case "E": return "e";
            case "E-": return "eminus";
            case "F+++": return "f3plus";
            case "F++": return "f2plus";
            case "F+": return "fplus";
            case "F": return "f";
            case "F-": return "fminus";
            case "G+++": return "g3plus";
            case "G++": return "g2plus";
            case "G+": return "gplus";
            case "G": return "g";
            case "G-": return "gminus";
            default: return "";
        }
    }

    // Populate Filters
    function populateFilters(continents) {
        const filter = document.getElementById('continent-filter');
        filter.innerHTML = '<option value="">All Continents</option>' +
            continents.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    // Debounce Function
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Show Error Function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/></svg>
            <p>${message}</p>
        `;
        document.body.prepend(errorDiv);
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Audio configuration
        const audioFiles = [
            'audio/TheElements_KahaPugeyMa.mp3',
            'audio/ekaadeshmaa.mp3',
            'audio/bekcha_ghamjoon.mp3'
        ];
        const FADE_DURATION = 2000;    // 2-second fade in/out
        const PLAY_DURATION = 60000;   // 60-second total cycle
        const MAX_VOLUME = 0.3;        // 30% volume
    
        // System state
        let currentAudio = null;
        let currentFadeInterval = null;
        let audioStarted = false;
        let isMusicPlaying = false;
    
        // Create music overlay dynamically
        const musicOverlay = document.createElement('div');
        musicOverlay.id = 'music-overlay';
        musicOverlay.innerHTML = `
            <button id="start-music">▶ Start the Codex Ambience</button>
        `;
        document.body.prepend(musicOverlay);
    
        // Audio control functions
        const getRandomTrack = () => {
            const track = new Audio(audioFiles[Math.floor(Math.random() * audioFiles.length)]);
            track.crossOrigin = 'anonymous'; // For CORS if needed
            return track;
        };
    
        const fadeAudio = (audio, targetVolume, duration, onComplete) => {
            const startVolume = audio.volume;
            const deltaVolume = targetVolume - startVolume;
            const startTime = Date.now();
    
            const updateVolume = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                audio.volume = startVolume + (deltaVolume * progress);
    
                if (progress < 1) {
                    currentFadeInterval = requestAnimationFrame(updateVolume);
                } else {
                    audio.volume = targetVolume;
                    onComplete?.();
                }
            };
    
            currentFadeInterval = requestAnimationFrame(updateVolume);
        };
    
        const playNextTrack = () => {
            if (!isMusicPlaying) return;
    
            // Cleanup previous track
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                cancelAnimationFrame(currentFadeInterval);
            }
    
            // Initialize new track
            currentAudio = getRandomTrack();
            currentAudio.volume = 0;
    
            currentAudio.play()
                .then(() => {
                    // Fade in
                    fadeAudio(currentAudio, MAX_VOLUME, FADE_DURATION, () => {
                        // Schedule fade out
                        setTimeout(() => {
                            fadeAudio(currentAudio, 0, FADE_DURATION, () => {
                                // Restart cycle
                                currentAudio.pause();
                                currentAudio.currentTime = 0;
                                playNextTrack();
                            });
                        }, PLAY_DURATION - (FADE_DURATION * 2));
                    });
                })
                .catch(error => console.error('Audio playback error:', error));
        };
    
        // Event handlers
        const initializeAudioSystem = () => {
            if (!audioStarted) {
                audioStarted = true;
                isMusicPlaying = true;
                musicOverlay.style.display = 'none';
                playNextTrack();
            }
        };
    
        // Start music on button click
        document.getElementById('start-music').addEventListener('click', initializeAudioSystem);
    
        // Pause/play on window visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isMusicPlaying = false;
                currentAudio?.pause();
            } else if (audioStarted) {
                isMusicPlaying = true;
                playNextTrack();
            }
        });
    });
});