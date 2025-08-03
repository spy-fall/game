// Main App Logic for Spyfall PWA
class SpyfallApp {
    constructor() {
        this.currentScreen = 'home';
        this.selectedSpyLocation = null;
        this.currentSpyPlayer = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen('home');
        this.detectAndGuideInstallation();
    }

    detectAndGuideInstallation() {
        // Detect iOS and non-Safari browsers
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isChrome = /CriOS/.test(navigator.userAgent); // Chrome iOS
        const isFirefox = /FxiOS/.test(navigator.userAgent); // Firefox iOS
        const isEdge = /EdgiOS/.test(navigator.userAgent); // Edge iOS
        const isSafari = /Safari/.test(navigator.userAgent) && !isChrome && !isFirefox && !isEdge;
        
        if (isIOS && !isSafari) {
            this.showSafariInstallGuide();
        }
    }

    showSafariInstallGuide() {
        // Create install guide modal
        const modal = document.createElement('div');
        modal.className = 'install-guide-modal';
        modal.innerHTML = `
            <div class="install-guide-content">
                <h3>📱 Install Spyfall App</h3>
                <p>For the best experience, install this app:</p>
                <ol>
                    <li>Copy this URL: <code>${window.location.href}</code></li>
                    <li>Open <strong>Safari</strong> browser</li>
                    <li>Paste the URL and visit this page</li>
                    <li>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></li>
                </ol>
                <div class="install-guide-buttons">
                    <button onclick="navigator.clipboard.writeText('${window.location.href}')">Copy URL</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Continue in Browser</button>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }

    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            
            // Update screen content
            this.updateScreenContent(screenName);
        }
    }

    updateScreenContent(screenName) {
        switch (screenName) {
            case 'setup':
                this.updateSetupScreen();
                break;
            case 'card-reveal':
                this.updateCardRevealScreen();
                break;
            case 'gameplay':
                this.updateGameplayScreen();
                break;
            case 'results':
                this.updateResultsScreen();
                break;
        }
    }

    // Event Binding
    bindEvents() {
        // Home screen events
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                this.showScreen('setup');
            });
        }

        // Setup screen events
        const addPlayerBtn = document.getElementById('add-player-btn');
        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => {
                this.addPlayer();
            });
        }

        const playerNameInput = document.getElementById('player-name-input');
        
        if (playerNameInput) {
            // Handle Enter key
            playerNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addPlayer();
                }
            });
            
            // Update button state based on input content
            const updateButtonState = () => {
                const hasText = playerNameInput.value.trim().length > 0;
                const addButton = document.getElementById('add-player-btn');
                if (addButton) {
                    addButton.disabled = !hasText;
                }
            };
            
            playerNameInput.addEventListener('input', updateButtonState);
            playerNameInput.addEventListener('paste', () => {
                setTimeout(updateButtonState, 0); // Allow paste to complete
            });
            
            // Initial button state
            updateButtonState();
        }

        const startPlayingBtn = document.getElementById('start-playing-btn');
        if (startPlayingBtn) {
            startPlayingBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                window.game.resetAll();
                this.showScreen('home');
            });
        }

        const restartSetupBtn = document.getElementById('restart-setup-btn');
        if (restartSetupBtn) {
            restartSetupBtn.addEventListener('click', () => {
                window.game.restartToSetup();
                this.showScreen('setup');
            });
        }

        // Gameplay events
        const timerControlBtn = document.getElementById('timer-control-btn');
        if (timerControlBtn) {
            timerControlBtn.addEventListener('click', () => {
                this.toggleTimer();
            });
        }

        const restartGameBtn = document.getElementById('restart-game-btn');
        if (restartGameBtn) {
            restartGameBtn.addEventListener('click', () => {
                window.game.restartToSetup();
                this.showScreen('setup');
            });
        }

        // Results events
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                window.game.restartToSetup();
                this.showScreen('setup');
            });
        }

        // Spy guess modal events
        const confirmGuessBtn = document.getElementById('confirm-guess-btn');
        if (confirmGuessBtn) {
            confirmGuessBtn.addEventListener('click', () => {
                this.confirmSpyGuess();
            });
        }
    }

    // Player Management
    addPlayer() {
        const input = document.getElementById('player-name-input');
        const addButton = document.getElementById('add-player-btn');
        const name = input.value.trim();
        
        if (name && window.game.addPlayer(name)) {
            // Clear input and provide visual feedback
            input.value = '';
            input.blur(); // Remove focus for smoother experience
            
            // Update button state immediately
            if (addButton) {
                addButton.disabled = true;
                
                // Pulse animation feedback
                addButton.classList.add('pulse');
                setTimeout(() => {
                    addButton.classList.remove('pulse');
                }, 300);
            }
            
            this.updateSetupScreen();
        }
    }

    removePlayer(playerId) {
        if (window.game.removePlayer(playerId)) {
            this.updateSetupScreen();
        }
    }

    toggleCategory(categoryId) {
        window.game.toggleCategory(categoryId);
        this.updateSetupScreen();
    }

    // Setup Screen
    updateSetupScreen() {
        // Update player count and status
        const playerCountStatus = document.getElementById('player-count-status');
        if (playerCountStatus) {
            playerCountStatus.textContent = window.game.players.length;
        }
        
        // Update players list
        this.updatePlayersList();
        
        // Update categories
        this.updateCategoriesList();
        
        // Update category count
        const categoryCountStatus = document.getElementById('category-count-status');
        if (categoryCountStatus) {
            categoryCountStatus.textContent = window.game.selectedCategories.length;
        }
        
        // Update start button
        this.updateStartButton();
        
        // Update step status indicators
        this.updateStepStatuses();
        
        // Show/hide empty states
        this.updateEmptyStates();
    }

    updatePlayersList() {
        const playersList = document.getElementById('players-list');
        const emptyState = document.getElementById('players-empty-state');
        const playerCount = window.game.players.length;
        
        if (playersList) {
            if (playerCount > 0) {
                playersList.innerHTML = window.game.players.map((player, index) => `
                    <div class="player-item">
                        <div class="player-info">
                            <div class="player-number">${index + 1}</div>
                            <span class="player-name">${player.name}</span>
                        </div>
                        <button class="remove-button" onclick="app.removePlayer('${player.id}')" title="Remove ${player.name}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                `).join('');
                
                if (emptyState) {
                    emptyState.style.display = 'none';
                }
            } else {
                playersList.innerHTML = '';
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            }
        }
    }

    updateCategoriesList() {
        const categoriesList = document.getElementById('categories-list');
        
        if (categoriesList) {
            categoriesList.innerHTML = GAME_DATA.categories.map(category => {
                const isSelected = window.game.selectedCategories.includes(category.id);
                
                return `
                    <div class="category-item ${isSelected ? 'selected' : ''}" onclick="app.toggleCategory('${category.id}')">
                        <div class="category-info">
                            <span class="category-emoji">${category.emoji}</span>
                            <div class="category-details">
                                <h4>${category.name}</h4>
                                <p>${category.locations.length} locations</p>
                            </div>
                        </div>
                        <div class="category-toggle">
                            ${isSelected ? '✓' : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }



    updateStepStatuses() {
        const playersStatus = document.getElementById('players-status');
        const categoriesStatus = document.getElementById('categories-status');
        
        if (playersStatus) {
            const playerCount = window.game.players.length;
            const statusIcon = playersStatus.querySelector('.status-icon');
            const statusText = playersStatus.querySelector('.status-text');
            
            if (playerCount >= 3) {
                playersStatus.className = 'status-indicator success';
                if (statusIcon) statusIcon.textContent = '✅';
                if (statusText) statusText.textContent = `${playerCount} players ready`;
            } else if (playerCount > 0) {
                playersStatus.className = 'status-indicator warning';
                if (statusIcon) statusIcon.textContent = '⚠️';
                if (statusText) statusText.textContent = `Need ${3 - playerCount} more player${3 - playerCount === 1 ? '' : 's'}`;
            } else {
                playersStatus.className = 'status-indicator';
                if (statusIcon) statusIcon.textContent = '⏳';
                if (statusText) statusText.textContent = 'Need 3+ players';
            }
        }
        
        if (categoriesStatus) {
            const categoryCount = window.game.selectedCategories.length;
            const statusIcon = categoriesStatus.querySelector('.status-icon');
            const statusText = categoriesStatus.querySelector('.status-text');
            
            if (categoryCount > 0) {
                categoriesStatus.className = 'status-indicator success';
                if (statusIcon) statusIcon.textContent = '✅';
                if (statusText) statusText.textContent = `${categoryCount} categor${categoryCount === 1 ? 'y' : 'ies'} selected`;
            } else {
                categoriesStatus.className = 'status-indicator';
                if (statusIcon) statusIcon.textContent = '⏳';
                if (statusText) statusText.textContent = 'Choose 1+ category';
            }
        }
    }

    updateStartButton() {
        const startBtn = document.getElementById('start-playing-btn');
        const btnSubtitle = document.getElementById('btn-subtitle');
        
        if (startBtn) {
            const isReady = window.game.isReadyToStart();
            startBtn.disabled = !isReady;
            
            if (btnSubtitle) {
                if (window.game.players.length < 3) {
                    btnSubtitle.textContent = 'Add players to continue';
                } else if (window.game.selectedCategories.length === 0) {
                    btnSubtitle.textContent = 'Choose categories to continue';
                } else {
                    btnSubtitle.textContent = 'Ready to start!';
                }
            }
        }
    }

    updateEmptyStates() {
        const playersEmptyState = document.getElementById('players-empty-state');
        
        if (playersEmptyState) {
            playersEmptyState.style.display = window.game.players.length === 0 ? 'block' : 'none';
        }
    }

    // Game Flow
    startGame() {
        if (window.game.startGame()) {
            this.showScreen('card-reveal');
        }
    }

    // Card Reveal Screen
    updateCardRevealScreen() {
        // Update player count
        const totalPlayersEl = document.getElementById('total-players');
        if (totalPlayersEl) {
            totalPlayersEl.textContent = window.game.players.length;
        }
        
        // Update cards grid
        this.updateCardsGrid();
        
        // Update progress
        this.updateCardRevealProgress();
    }

    updateCardsGrid() {
        const cardGrid = document.getElementById('card-grid');
        if (cardGrid) {
            if (window.game.players.length === 0) {
                cardGrid.innerHTML = '<div class="empty-state">No players found. Please restart setup.</div>';
                return;
            }
            
            cardGrid.innerHTML = window.game.players.map((player, index) => {
                const isDisabled = window.game.isCardDisabled(player.id);
                return this.createPlayerCard(player, index, isDisabled);
            }).join('');
        }
    }

    createPlayerCard(player, index, isDisabled) {
        let cardState = '';
        let cardContent = '';
        
        if (player.hasFinishedCard) {
            cardState = 'finished';
            cardContent = `
                <h3 class="card-title">Confirmed</h3>
                <p class="card-subtitle">Ready to play</p>
            `;
        } else if (player.isCardRevealed) {
            if (player.role === 'spy') {
                cardState = 'spy revealed';
                cardContent = `
                    <div class="card-icon">🕵️</div>
                    <h3 class="card-title">SPY</h3>
                    <p class="card-subtitle">Find the location!</p>
                `;
            } else {
                cardState = 'civilian revealed';
                cardContent = `
                    <div class="card-icon">📍</div>
                    <h3 class="card-title">${window.game.currentLocation}</h3>
                    <p class="card-subtitle">Find the spies!</p>
                `;
            }
        } else {
            cardContent = `
                <h3 class="card-title">${player.name}</h3>
                <p class="card-subtitle">${isDisabled ? 'Wait your turn' : 'Tap to reveal'}</p>
            `;
        }

        return `
            <div class="reveal-card ${cardState} ${isDisabled ? 'disabled' : ''}" 
                 onclick="app.handleCardClick('${player.id}')">
                ${cardContent}
            </div>
        `;
    }

    handleCardClick(playerId) {
        if (window.game.togglePlayerCard(playerId)) {
            this.updateCardsGrid();
            this.updateCardRevealProgress();
            
            if (window.game.allPlayersFinished()) {
                // Small delay to let the last card animation complete
                setTimeout(() => {
                    this.startGameTransition();
                }, 300);
            }
        }
    }

    startGameTransition() {
        // Show transition overlay
        this.showGameStartingOverlay();
        
        // Add visual effects to cards
        const cardsGrid = document.getElementById('card-grid');
        if (cardsGrid) {
            cardsGrid.classList.add('cards-complete');
        }
        
        // Transition to gameplay after animation
        setTimeout(() => {
            this.hideGameStartingOverlay();
            this.showScreen('gameplay');
        }, 2000);
    }

    showGameStartingOverlay() {
        // Create or show overlay
        let overlay = document.getElementById('game-starting-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'game-starting-overlay';
            overlay.className = 'game-starting-overlay';
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-icon">🕵️‍♂️</div>
                <div class="transition-title">All Players Ready!</div>
                <div class="transition-subtitle">The investigation begins...</div>
                <div class="transition-timer">
                    <div class="timer-circle">
                        <div class="timer-fill"></div>
                    </div>
                </div>
            </div>
        `;
        
        overlay.classList.add('active');
        
        // Start timer animation
        setTimeout(() => {
            const timerFill = overlay.querySelector('.timer-fill');
            if (timerFill) {
                timerFill.style.animationDuration = '2s';
                timerFill.classList.add('animate');
            }
        }, 100);
    }

    hideGameStartingOverlay() {
        const overlay = document.getElementById('game-starting-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Clean up cards animation
        const cardsGrid = document.getElementById('card-grid');
        if (cardsGrid) {
            cardsGrid.classList.remove('cards-complete');
        }
    }

    updateCardRevealProgress() {
        const finishedCount = window.game.players.filter(p => p.hasFinishedCard).length;
        const totalCount = window.game.players.length;
        const percentage = totalCount > 0 ? (finishedCount / totalCount) * 100 : 0;
        
        // Update progress bar
        const progressBarFill = document.getElementById('progress-bar-fill');
        if (progressBarFill) {
            progressBarFill.style.width = `${percentage}%`;
        }
        
        // Update progress count
        const progressCount = document.getElementById('progress-count');
        if (progressCount) {
            progressCount.textContent = finishedCount;
        }
        
        const totalPlayersEl = document.getElementById('total-players');
        if (totalPlayersEl) {
            totalPlayersEl.textContent = totalCount;
        }
    }

    // Gameplay Screen
    updateGameplayScreen() {
        this.startGameTimer();
        this.updateGameplayStats();
        this.updateVotingGrid();
        this.updateTimerControls();
    }

    updateTimerControls() {
        const timerBtn = document.getElementById('timer-control-btn');
        if (timerBtn) {
            if (window.game.isTimerRunning) {
                timerBtn.innerHTML = '<span class="btn-text">Pause</span>';
                timerBtn.title = 'Pause Game';
                timerBtn.setAttribute('aria-label', 'Pause the game timer');
                timerBtn.className = 'modern-control-btn pause-btn';
            } else {
                timerBtn.innerHTML = '<span class="btn-text">Resume</span>';
                timerBtn.title = 'Resume Game';
                timerBtn.setAttribute('aria-label', 'Resume the game timer');
                timerBtn.className = 'modern-control-btn resume-btn';
            }
        }
    }

    startGameTimer() {
        const timerDisplay = document.getElementById('timer-display');
        const timerRing = document.querySelector('.timer-ring-circle');
        
        const updateTimer = () => {
            if (timerDisplay) {
                timerDisplay.textContent = window.game.formatTime(window.game.timeRemaining);
                
                // Change color based on time remaining
                if (window.game.timeRemaining <= 30) {
                    timerDisplay.classList.add('timer-critical');
                } else {
                    timerDisplay.classList.remove('timer-critical');
                }
            }
            
            if (timerRing) {
                // Update timer ring
                const percentage = (window.game.timeRemaining / GAME_DATA.constants.GAME_DURATION) * 100;
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (percentage / 100) * circumference;
                timerRing.style.strokeDashoffset = offset;
                
                // Change color based on time remaining
                if (window.game.timeRemaining <= 30) {
                    timerRing.style.stroke = '#ef4444';
                } else if (window.game.timeRemaining <= 60) {
                    timerRing.style.stroke = '#f97316';
                } else {
                    timerRing.style.stroke = '#3b82f6';
                }
            }
        };

        // Update immediately
        updateTimer();
        
        // Continue timer updates
        setTimeout(() => this.startGameTimer(), 1000);
    }

    updateGameplayStats() {
        const activePlayersEl = document.getElementById('active-players');
        if (activePlayersEl) {
            activePlayersEl.textContent = window.game.getActivePlayersCount();
        }
        
        const eliminatedPlayersEl = document.getElementById('eliminated-players');
        if (eliminatedPlayersEl) {
            eliminatedPlayersEl.textContent = window.game.getEliminatedPlayersCount();
        }
        
        const hiddenSpiesEl = document.getElementById('hidden-spies');
        if (hiddenSpiesEl) {
            hiddenSpiesEl.textContent = window.game.getActiveSpiesCount();
        }
    }

    toggleTimer() {
        if (window.game.isTimerRunning) {
            window.game.pauseTimer();
        } else {
            window.game.resumeTimer();
        }
        this.updateTimerControls();
    }

    updateVotingGrid() {
        const votingGrid = document.getElementById('voting-grid');
        
        if (votingGrid) {
            votingGrid.innerHTML = window.game.players.map((player, index) => `
                <div class="vote-player-card ${player.isEliminated ? 'eliminated' : ''} ${player.isDisabledFromVoting ? 'disabled' : ''}" 
                     onclick="${!player.isEliminated && !player.isDisabledFromVoting ? `app.handleVote('${player.id}')` : ''}"
                     data-player-id="${player.id}">
                    <div class="vote-player-info">
                        <div class="vote-player-name">${player.name}</div>
                        <div class="vote-player-status">
                            ${player.isEliminated ? 'Eliminated' : (player.isDisabledFromVoting ? 'Cannot vote' : 'Tap to vote out')}
                        </div>
                        <div class="vote-result-message" id="vote-message-${player.id}"></div>
                    </div>
                    ${!player.isEliminated && !player.isDisabledFromVoting ? `
                        <button class="vote-button" onclick="event.stopPropagation(); app.handleVote('${player.id}')">
                            Vote
                        </button>
                    ` : ''}
                </div>
            `).join('');
        }
    }

    updateSingleVotingCard(playerId) {
        const votingGrid = document.getElementById('voting-grid');
        if (!votingGrid) return;

        const player = window.game.getPlayerById(playerId);
        if (!player) return;

        // Find the specific card element for this player
        const cardElement = votingGrid.querySelector(`[data-player-id="${playerId}"]`);
        
        if (cardElement) {
            // Update classes
            cardElement.className = `vote-player-card ${player.isEliminated ? 'eliminated' : ''} ${player.isDisabledFromVoting ? 'disabled' : ''}`;
            
            // Update onclick handler
            if (player.isEliminated || player.isDisabledFromVoting) {
                cardElement.removeAttribute('onclick');
            }
            
            // Update status text
            const statusElement = cardElement.querySelector('.vote-player-status');
            if (statusElement) {
                statusElement.textContent = player.isEliminated ? 'Eliminated' : 
                    (player.isDisabledFromVoting ? 'Cannot vote' : 'Tap to vote out');
            }
            
            // Remove vote button if player is eliminated or disabled
            const voteButton = cardElement.querySelector('.vote-button');
            if (voteButton && (player.isEliminated || player.isDisabledFromVoting)) {
                voteButton.remove();
            }
        }
    }

    handleVote(playerId) {
        const player = window.game.getPlayerById(playerId);
        if (player.isEliminated) return;
        
        const isSpy = window.game.voteForPlayer(playerId);
        
        if (isSpy) {
            // Found a spy - show location guess modal
            this.currentSpyPlayer = player;
            this.showSpyGuessModal();
        } else {
            // Not a spy - eliminate and show message
            window.game.eliminatePlayer(playerId);
            this.showVoteResult(`Not a spy - eliminated`, false, playerId);
            this.updateGameplayStats();
            this.updateSingleVotingCard(playerId);
        }
    }

    showVoteResult(message, isSuccess, playerId) {
        if (!playerId) return;
        
        const messageElement = document.getElementById(`vote-message-${playerId}`);
        if (!messageElement) return;
        
        // Set message content and styling
        messageElement.textContent = message;
        messageElement.className = `vote-result-message ${isSuccess ? 'success' : 'failure'} show`;
        
        // Message stays visible - no auto-clear
    }

    // Spy Guess Modal
    showSpyGuessModal() {
        const modal = document.getElementById('spy-guess-modal');
        const overlay = document.getElementById('overlay');
        const spyName = document.getElementById('spy-name');
        const locationsGrid = document.getElementById('location-guess-grid');
        
        if (spyName) {
            spyName.textContent = `${this.currentSpyPlayer.name} is the SPY!`;
        }
        
        const locations = window.game.getAvailableLocations();
        if (locationsGrid) {
            locationsGrid.innerHTML = locations.map(location => `
                <div class="location-option" onclick="app.selectLocation(${JSON.stringify(location).replace(/"/g, '&quot;')})">
                    <span>${location}</span>
                </div>
            `).join('');
        }
        
        this.selectedSpyLocation = null;
        const confirmBtn = document.getElementById('confirm-guess-btn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
        }
        
        if (modal) {
            modal.classList.remove('hidden');
        }
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        document.body.style.overflow = 'hidden';
    }

    selectLocation(location) {
        // Remove previous selection
        document.querySelectorAll('.location-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        if (event && event.target) {
            const clickedOption = event.target.closest('.location-option');
            if (clickedOption) {
                clickedOption.classList.add('selected');
            }
        }
        
        this.selectedSpyLocation = location;
        const confirmBtn = document.getElementById('confirm-guess-btn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
    }

    confirmSpyGuess() {
        if (!this.selectedSpyLocation || !this.currentSpyPlayer) return;
        
        // Save spy player reference before it gets cleared by hideSpyGuessModal
        const spyPlayer = this.currentSpyPlayer;
        const isCorrect = window.game.guessLocation(spyPlayer.id, this.selectedSpyLocation);
        
        this.hideSpyGuessModal();
        
        if (window.game.gameResult) {
            setTimeout(() => {
                this.showScreen('results');
            }, 1500);
        } else {
            this.updateGameplayStats();
            this.updateSingleVotingCard(spyPlayer.id);
            
            // Show result message only if game continues (no vote result for game end)
            const message = isCorrect ? 
                `Correct guess - Spies win!` :
                `Wrong guess - eliminated`;
            this.showVoteResult(message, isCorrect, spyPlayer.id);
        }
    }

    hideSpyGuessModal() {
        const modal = document.getElementById('spy-guess-modal');
        const overlay = document.getElementById('overlay');
        
        if (modal) {
            modal.classList.add('hidden');
        }
        if (overlay) {
            overlay.classList.add('hidden');
        }
        document.body.style.overflow = '';
        
        this.selectedSpyLocation = null;
        this.currentSpyPlayer = null;
    }

    // Results Screen
    updateResultsScreen() {
        const resultTitle = document.getElementById('result-title');
        
        if (resultTitle) {
            if (window.game.gameResult === 'spy-wins') {
                resultTitle.textContent = 'Spies Win!';
            } else {
                resultTitle.textContent = 'Civilians Win!';
            }
        }
        
        // Update game stats
        const gameDurationEl = document.getElementById('game-duration');
        if (gameDurationEl) {
            gameDurationEl.textContent = window.game.formatTime(window.game.getGameDuration());
        }
        
        const totalPlayersCountEl = document.getElementById('total-players-count');
        if (totalPlayersCountEl) {
            totalPlayersCountEl.textContent = window.game.players.length;
        }
        
        const spyCountEl = document.getElementById('spy-count');
        if (spyCountEl) {
            spyCountEl.textContent = window.game.getSpyPlayers().length;
        }
        
        // Update game details
        this.updateGameDetails();
        
        // Update players list
        this.updateResultsPlayersList();
        
        // Update winning reason
        this.updateWinningReason();
    }

    updateGameDetails() {
        const gameLocationEl = document.getElementById('game-location');
        if (gameLocationEl) {
            gameLocationEl.textContent = window.game.currentLocation || 'Unknown';
        }
        
        // Add other game details as needed
    }

    updateResultsPlayersList() {
        const playerList = document.getElementById('results-player-list');
        
        if (playerList) {
            playerList.innerHTML = window.game.players.map((player, index) => {
                const isSpy = player.role === 'spy';
                return `
                    <div class="results-player-card ${isSpy ? 'spy' : 'civilian'} ${player.isEliminated ? 'eliminated' : ''}">
                        <div class="results-player-name">${player.name}</div>
                        <div class="results-player-role">
                            <span>${isSpy ? '🕵️ Spy' : '👤 Civilian'}</span>
                            ${player.isEliminated ? ' • Eliminated' : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    updateWinningReason() {
        const winningReasonTextEl = document.getElementById('winning-reason-text');
        const reasonCardEl = document.querySelector('.reason-card');
        
        if (winningReasonTextEl && reasonCardEl) {
            // Remove previous styling classes
            reasonCardEl.classList.remove('spy-wins', 'civilian-wins');
            
            if (window.game.gameResult === 'spy-wins') {
                winningReasonTextEl.textContent = window.game.gameEndReason || 'Spies successfully avoided detection';
                reasonCardEl.classList.add('spy-wins');
            } else if (window.game.gameResult === 'civilian-wins') {
                winningReasonTextEl.textContent = window.game.gameEndReason || 'Civilians successfully identified all spies';
                reasonCardEl.classList.add('civilian-wins');
            } else {
                winningReasonTextEl.textContent = 'Game completed';
            }
        }
    }

    // Utility Functions
    showToast(message) {
        // Simple toast notification (could be enhanced)
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 3000;
            font-size: 14px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpyfallApp();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    // Check for game end conditions
    setInterval(() => {
        if (window.game.gameResult && window.app.currentScreen !== 'results') {
            window.app.showScreen('results');
        }
    }, 500);
}); 