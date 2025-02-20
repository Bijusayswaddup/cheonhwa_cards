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

    // Audio file paths (add your own paths)
    const audioFiles = [
        'audio/themesong-1.mp3',
        'audio/themesong-2.mp3'
    ];

    // Audio configuration
    const FADE_DURATION = 500; // 2 seconds
    const PLAY_DURATION = 220000; // 3 minutes and 40 seconds
    const MAX_VOLUME = 0.3; // 30% volume

    let currentAudio = null;
    let currentFadeInterval = null;

    // Randomly select next track
    function getRandomTrack() {
        return new Audio(audioFiles[Math.floor(Math.random() * audioFiles.length)]);
    }

    function fadeAudio(audio, targetVolume, duration, onComplete) {
        const initialVolume = audio.volume;
        const volumeChange = targetVolume - initialVolume;
        const startTime = Date.now();

        function updateVolume() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            audio.volume = initialVolume + (volumeChange * progress);

            if (progress < 1) {
                currentFadeInterval = requestAnimationFrame(updateVolume);
            } else {
                audio.volume = targetVolume; // Ensure exact target
                if (onComplete) onComplete();
            }
        }

        currentFadeInterval = requestAnimationFrame(updateVolume);
    }

    function playNextTrack() {
        // Cleanup previous audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            cancelAnimationFrame(currentFadeInterval);
        }

        // Create new audio element
        currentAudio = getRandomTrack();
        currentAudio.volume = 0;
        currentAudio.play()
            .then(() => {
                // Fade in
                fadeAudio(currentAudio, MAX_VOLUME, FADE_DURATION, () => {
                    // Schedule fade out
                    setTimeout(() => {
                        fadeAudio(currentAudio, 0, FADE_DURATION, () => {
                            currentAudio.pause();
                            currentAudio.currentTime = 0;
                            // Restart cycle
                            playNextTrack();
                        });
                    }, PLAY_DURATION - FADE_DURATION * 2);
                });
            })
            .catch(error => console.error('Audio play failed:', error));
    }

    // Start the sequence
    playNextTrack();
});