document.addEventListener('copy', function(e) {
    e.preventDefault();
    alert('No Cheating Mate!');
});

var LetterGame = {
    timer: null,
    seconds: 10,
    sequence: '',
    gameRunning: false,
    score: 0,
    difficulty: 'easy',

    initializeGame: function() {
        this.seconds = this.difficulty === 'easy' ? 10 : this.difficulty === 'medium' ? 8 : 5;
        this.sequence = this.generateRandomSequence();
        this.clearInput();
        this.updateTimer();
        this.score = 0;
        this.updateScore();
        this.displayLeaderboard();
    },

    setDifficulty: function() {
        this.difficulty = document.getElementById('difficulty-select').value;
    },

    startGame: function() {
        this.setDifficulty();
        this.gameRunning = true;
        this.initializeGame();
        this.displayLetters();
        document.getElementById('input-field').focus();
    },

    generateRandomSequence: function() {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.difficulty === 'medium') {
            characters += '1234567890';
        } else if (this.difficulty === 'hard') {
            characters += '1234567890!@#$%^&*';
        } 
        let randomSequence = '';
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomSequence += characters[randomIndex];
        }
        return randomSequence;
    },

    displayLetters: function() {
        const lettersContainer = document.getElementById('letters-container');
        lettersContainer.textContent = this.sequence;
    },

    updateTimer: function() {
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

    endGame: function(win) {
        clearInterval(this.timer);
        this.gameRunning = false;
        if (win) {
            this.score++;
            this.showNotification('Congratulations! You won!', 'success');
        } else {
            this.showNotification('Game Over! You lost.', 'error');
        }
        this.updateScore();
        this.updateLeaderboard();
    },

    clearInput: function() {
        document.getElementById('input-field').value = '';
    },

    checkInput: function() {
        if (this.gameRunning) {
            const userInput = document.getElementById('input-field').value.toUpperCase();
            if (userInput !== this.sequence.substr(0, userInput.length)) {
                this.endGame(false);
            } else if (userInput === this.sequence) {
                this.endGame(true);
            }
        }
    },

    updateScore: function() {
        document.getElementById('score').textContent = 'Score: ' + this.score;
    },

    showNotification: function(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    },

    updateLeaderboard: function() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(this.score);
        leaderboard.sort((a, b) => b - a);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5))); // Store top 5 scores
    },

    displayLeaderboard: function() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        leaderboard.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `Score: ${score}`;
            leaderboardList.appendChild(li);
        });
    }
};

document.getElementById('start-button').addEventListener('click', function() {
    LetterGame.startGame();
});

document.getElementById('input-field').addEventListener('input', function() {
    LetterGame.checkInput();
});

document.getElementById('restart-button').addEventListener('click', function() {
    LetterGame.startGame();
});