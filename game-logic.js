// Game Logic for Spyfall PWA
class SpyfallGame {
    constructor() {
        this.players = [];
        this.spyIndices = [];
        this.currentLocation = null;
        this.selectedCategories = [];
        this.timeRemaining = GAME_DATA.constants.GAME_DURATION;
        this.isTimerRunning = false;
        this.gameResult = null;
        this.gameEndReason = null;
        this.gameStartTime = null;
        this.revealStates = {}; // Track card reveal states
        this.currentlyRevealed = null; // Track which player is currently viewing
    }

    reset() {
        this.players = [];
        this.selectedCategories = [];
        this.currentLocation = null;
        this.spyIndices = [];
        this.gameTimer = null;
        this.timeRemaining = GAME_DATA.constants.GAME_DURATION;
        this.isTimerRunning = false;
        this.gameStartTime = null;
        this.gameResult = null;
        this.gameEndReason = null;
        this.revealStates = {}; // Track card reveal states
        this.currentlyRevealed = null; // Track which player is currently viewing
    }

    // Player Management
    addPlayer(name) {
        const trimmedName = name.trim();
        if (!trimmedName || this.players.length >= GAME_DATA.constants.MAX_PLAYERS) {
            return false;
        }

        // Check for duplicate names (case insensitive)
        if (this.players.some(player => 
            player.name.toLowerCase() === trimmedName.toLowerCase()
        )) {
            return false;
        }

        const player = {
            id: this.generateId(),
            name: trimmedName,
            role: null,
            isCardRevealed: false,
            hasFinishedCard: false,
            isDisabledFromVoting: false,
            isEliminated: false
        };

        this.players.push(player);
        return true;
    }

    removePlayer(playerId) {
        const index = this.players.findIndex(player => player.id === playerId);
        if (index !== -1) {
            this.players.splice(index, 1);
            return true;
        }
        return false;
    }

    // Category Management
    toggleCategory(categoryId) {
        const index = this.selectedCategories.indexOf(categoryId);
        if (index === -1) {
            this.selectedCategories.push(categoryId);
        } else {
            this.selectedCategories.splice(index, 1);
        }
    }

    isReadyToStart() {
        return this.players.length >= GAME_DATA.constants.MIN_PLAYERS && 
               this.selectedCategories.length > 0;
    }

    // Game Flow
    startGame() {
        if (!this.isReadyToStart()) {
            return false;
        }

        // Select random location
        this.currentLocation = GAME_DATA.getRandomLocation(this.selectedCategories);
        if (!this.currentLocation) {
            return false;
        }

        // Assign spies
        this.assignSpies();

        // Reset card states
        this.revealStates = {};
        this.currentlyRevealed = null;
        this.players.forEach(player => {
            player.isCardRevealed = false;
            player.hasFinishedCard = false;
            player.isDisabledFromVoting = false;
            player.isEliminated = false;
        });

        // Reset timer
        this.timeRemaining = GAME_DATA.constants.GAME_DURATION;
        this.isTimerRunning = false;
        this.gameStartTime = null;
        this.gameResult = null;

        return true;
    }

    assignSpies() {
        const spyCount = GAME_DATA.getSpyCount(this.players.length);
        const shuffledIndices = [...Array(this.players.length).keys()].sort(() => 0.5 - Math.random());
        this.spyIndices = shuffledIndices.slice(0, spyCount).sort((a, b) => a - b);

        // Assign roles
        this.players.forEach((player, index) => {
            player.role = this.spyIndices.includes(index) ? 'spy' : 'civilian';
        });
    }

    // Card Reveal Logic
    togglePlayerCard(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player || player.hasFinishedCard) {
            return false;
        }

        // Check if another card is currently revealed and this isn't that card
        if (this.currentlyRevealed && this.currentlyRevealed !== playerId) {
            return false; // Can't reveal while another is revealed
        }

        if (!player.isCardRevealed) {
            // First tap - reveal card
            player.isCardRevealed = true;
            this.currentlyRevealed = playerId;
        } else {
            // Second tap - confirm and hide card
            player.isCardRevealed = false;
            player.hasFinishedCard = true;
            this.currentlyRevealed = null;

            // Check if all players have finished
            if (this.allPlayersFinished()) {
                // Start the game timer after a short delay
                setTimeout(() => {
                    this.startTimer();
                }, 1000);
            }
        }

        return true;
    }

    allPlayersFinished() {
        return this.players.every(player => player.hasFinishedCard);
    }

    isCardDisabled(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player || player.hasFinishedCard) {
            return false;
        }

        // Don't disable other cards when one is revealed
        return false;
    }

    // Timer Management
    startTimer() {
        if (this.gameTimer) {
            this.stopTimer();
        }

        this.isTimerRunning = true;
        this.gameStartTime = Date.now();

        this.gameTimer = setInterval(() => {
            this.timeRemaining--;
            
            if (this.timeRemaining <= 0) {
                this.endGame('spy-wins', 'Time ran out - Spies successfully avoided detection');
                return;
            }
        }, 1000);
    }

    pauseTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        this.isTimerRunning = false;
    }

    resumeTimer() {
        if (!this.isTimerRunning && this.timeRemaining > 0) {
            this.startTimer();
        }
    }

    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        this.isTimerRunning = false;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Voting Logic
    voteForPlayer(playerId) {
        const playerIndex = this.players.findIndex(p => p.id === playerId);
        return this.spyIndices.includes(playerIndex);
    }

    eliminatePlayer(playerId, isCorrectGuess = false) {
        const playerIndex = this.players.findIndex(p => p.id === playerId);
        const player = this.players[playerIndex];
        
        if (!player || player.isDisabledFromVoting) {
            return false;
        }

        // Mark player as eliminated
        player.isDisabledFromVoting = true;

        // If this was a spy
        if (this.spyIndices.includes(playerIndex)) {
            // Remove from spy indices
            this.spyIndices = this.spyIndices.filter(index => index !== playerIndex);

            if (isCorrectGuess) {
                // Spy guessed correctly - spies win
                this.endGame('spy-wins', 'Spy correctly identified the location');
                return true;
            } else {
                // Spy guessed wrong - check if any spies remain
                const activeSpies = this.spyIndices.filter(index => 
                    !this.players[index].isDisabledFromVoting
                );

                if (activeSpies.length === 0) {
                    // No more spies - civilians win
                    this.endGame('civilian-wins', 'All spies have been eliminated');
                    return true;
                }
            }
        }

        // Check normal spy victory condition (majority)
        this.checkSpyVictoryCondition();
        return false; // Game continues
    }

    checkSpyVictoryCondition() {
        const activePlayers = this.players.filter(player => !player.isDisabledFromVoting);
        const activeSpies = this.spyIndices.filter(index => 
            index < this.players.length && !this.players[index].isDisabledFromVoting
        );

        // Spies win if they have majority (spies * 2 >= total active)
        if (activeSpies.length * 2 >= activePlayers.length) {
            this.endGame('spy-wins', 'Spies gained majority control');
        }
    }

    // Location Guessing
    guessLocation(playerId, guessedLocation) {
        const playerIndex = this.players.findIndex(p => p.id === playerId);
        
        if (!this.spyIndices.includes(playerIndex)) {
            return false; // Only spies can guess
        }

        const isCorrect = guessedLocation === this.currentLocation;
        this.eliminatePlayer(playerId, isCorrect);
        
        return isCorrect;
    }

    getAvailableLocations() {
        return GAME_DATA.getLocationsFromCategories(this.selectedCategories);
    }

    // Game End
    endGame(result, reason = null) {
        this.stopTimer();
        this.gameResult = result;
        this.gameEndReason = reason;
    }

    // Game Statistics
    getGameDuration() {
        return GAME_DATA.constants.GAME_DURATION - this.timeRemaining;
    }

    getActivePlayersCount() {
        return this.players.filter(player => !player.isDisabledFromVoting).length;
    }

    getEliminatedPlayersCount() {
        return this.players.filter(player => player.isDisabledFromVoting).length;
    }

    getActiveSpiesCount() {
        return this.spyIndices.filter(index => 
            index < this.players.length && !this.players[index].isDisabledFromVoting
        ).length;
    }

    // Restart Functions
    restartToSetup() {
        this.stopTimer();
        this.currentLocation = null;
        this.spyIndices = [];
        this.gameResult = null;
        this.gameEndReason = null;
        this.revealStates = {};
        this.currentlyRevealed = null;
        this.timeRemaining = GAME_DATA.constants.GAME_DURATION;
        this.isTimerRunning = false;
        this.gameStartTime = null;

        // Reset player states but keep players and categories
        this.players.forEach(player => {
            player.role = null;
            player.isCardRevealed = false;
            player.hasFinishedCard = false;
            player.isDisabledFromVoting = false;
        });
    }

    resetAll() {
        this.reset();
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getPlayerById(playerId) {
        return this.players.find(player => player.id === playerId);
    }

    getSpyPlayers() {
        return this.spyIndices.map(index => this.players[index]).filter(Boolean);
    }

    getCivilianPlayers() {
        return this.players.filter((_, index) => !this.spyIndices.includes(index));
    }
}

// Create global game instance
window.game = new SpyfallGame(); 