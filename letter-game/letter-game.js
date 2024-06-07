document.addEventListener('copy', (e) => {
    e.preventDefault();
    alert('No Cheating Mate!');
});

const LetterGame = {
    timer: null,
    seconds: 10,
    sequence: '',
    gameRunning: false,
    score: 0,
    difficulty: 'easy',

    initializeGame() {
        this.setDifficulty();
        this.seconds = this.getDifficultySeconds();
        this.sequence = this.generateRandomSequence();
        this.resetGame();
        this.updateTimer();
        this.displayLeaderboard();
    },

    setDifficulty() {
        this.difficulty = document.getElementById('difficulty-select').value;
    },

    getDifficultySeconds() {
        return this.difficulty === 'easy'? 10 : this.difficulty === 'medium'? 8 : 5;
    },

    startGame() {
        this.gameRunning = true;
        this.initializeGame();
        this.displayLetters();
        document.getElementById('input-field').focus();
    },

    generateRandomSequence() {
        const characters = this.getCharactersForDifficulty();
        let randomSequence = '';
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomSequence += characters[randomIndex];
        }
        return randomSequence;
    },

    getCharactersForDifficulty() {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.difficulty === 'medium') {
            characters += '1234567890';
        } else if (this.difficulty === 'hard') {
            characters += '1234567890@#$%^&*';
        }
        return characters;
    },

    displayLetters() {
        document.getElementById('letters-container').textContent = this.sequence;
    },

    updateTimer() {
        clearInterval(this.timer);
        document.getElementById('timer').textContent = this.seconds;
        if (this.gameRunning) {
            this.timer = setInterval(() => {
                this.seconds--;
                document.getElementById('timer').textContent = this.seconds;
                if (this.seconds === 0) {
                    this.endGame(false);
                }
            }, 1000);
        }
    },

    endGame(win) {
        clearInterval(this.timer);
        this.gameRunning = false;
        this.showNotification(win? 'Congratulations You won!' : 'Game Over You lost.', win? 'success' : 'error');
        this.updateScore();
        this.updateLeaderboard();
    },

    resetGame() {
        this.clearInput();
        this.score = 0;
        this.updateScore();
    },

    clearInput() {
        document.getElementById('input-field').value = '';
    },

    checkInput() {
        if (this.gameRunning) {
            const userInput = document.getElementById('input-field').value.toUpperCase();
            if (userInput!== this.sequence.substr(0, userInput.length)) {
                this.endGame(false);
            } else if (userInput === this.sequence) {
                this.endGame(true);
            }
        }
    },

    updateScore() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    },

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    },

    updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(this.score);
        leaderboard.sort((a, b) => b - a);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5))); // Store top 5 scores
    },

    displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = leaderboard.map(score => `<li>Score: ${score}</li>`).join('');
    }
};

document.getElementById('start-button').addEventListener('click', () => LetterGame.startGame());
document.getElementById('input-field').addEventListener('input', () => LetterGame.checkInput());
document.getElementById('restart-button').addEventListener('click', () => LetterGame.startGame());
