document.addEventListener('DOMContentLoaded', () => {
    const godsContainer = document.getElementById('gods-container');
    const modalOverlay = document.getElementById('celestialModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDomain = document.getElementById('modalDomain');
    const statPower = document.getElementById('statPower');
    const statInfluence = document.getElementById('statInfluence');
    const strengthsList = document.getElementById('strengthsList');
    const weaknessesList = document.getElementById('weaknessesList');
    const loreContent = document.getElementById('loreContent');
    const modalImage = document.getElementById('modalImage');
    const closeModalButton = document.querySelector('.modal-close');

    // Fetch divine data
    fetch('gods.json')
        .then(response => response.json())
        .then(data => {
            data.gods.forEach(god => createGodCard(god));
        })
        .catch(error => {
            console.error('Failed to summon the Pantheon:', error);
            showErrorState();
        });

    // Create divine cards
    function createGodCard(god) {
        const card = document.createElement('div');
        card.className = 'divine-card';
        card.innerHTML = `
            <div class="divine-avatar-container">
                <img src="${god.image}" alt="${god.name}" class="divine-avatar">
            </div>
            <div class="card-content">
                <h2 class="divine-name">${god.name}</h2>
                <h3 class="divine-title">${god.title}</h3>
                <div class="divine-stats">
                    <span class="stat-pill">${god.stats.power}</span>
                    <span class="stat-pill">${god.stats.influence}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => showGodModal(god));
        godsContainer.appendChild(card);
    }

    // Show celestial modal
    function showGodModal(god) {
        modalTitle.textContent = god.name;
        modalDomain.textContent = god.domain;
        statPower.textContent = god.stats.power;
        statInfluence.textContent = god.stats.influence;

        strengthsList.innerHTML = god.strengths.map(str => `<li>${str}</li>`).join('');
        weaknessesList.innerHTML = god.weaknesses.map(weak => `<li>${weak}</li>`).join('');
        loreContent.textContent = god.lore;
        modalImage.src = god.image;

        modalOverlay.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    // Close modal
    closeModalButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Error handling
    function showErrorState() {
        godsContainer.innerHTML = `
            <div class="divine-error">
                <h2>⚡ Celestial Connection Lost ⚡</h2>
                <p>The divine energies have scattered across the cosmos...</p>
                <button onclick="location.reload()">Reattempt Summoning Ritual</button>
            </div>
        `;
    }
});