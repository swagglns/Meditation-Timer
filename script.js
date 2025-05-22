document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timeDisplay = document.getElementById('time');
    const totalTimeInput = document.getElementById('totalTime');
    const intervalTimeInput = document.getElementById('intervalTime');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const intervalSound = document.getElementById('intervalSound');
    const endSound = document.getElementById('endSound');

    // Timer variables
    let timer = null;
    let totalTimeInSeconds = 0;
    let remainingTime = 0;
    let intervalTimeInSeconds = 0;
    let nextIntervalAt = 0;
    let isRunning = false;

    // Format time in MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update the timer display
    function updateDisplay() {
        timeDisplay.textContent = formatTime(remainingTime);
    }

    // Play sound function
    function playSound(sound) {
        // Reset the audio to the beginning
        sound.currentTime = 0;
        // Play the sound
        sound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }

    // Timer tick function
    function timerTick() {
        if (remainingTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            updateDisplay();
            playSound(endSound);
            return;
        }

        remainingTime--;
        
        // Check if we've reached an interval
        if (intervalTimeInSeconds > 0 && remainingTime === nextIntervalAt) {
            playSound(intervalSound);
            nextIntervalAt = remainingTime - intervalTimeInSeconds;
        }
        
        updateDisplay();
    }

    // Start the timer
    function startTimer() {
        if (isRunning) return;
        
        // Get values from inputs
        const totalMinutes = parseInt(totalTimeInput.value);
        const intervalMinutes = parseInt(intervalTimeInput.value);
        
        if (isNaN(totalMinutes) || totalMinutes <= 0) {
            alert('Please enter a valid total time');
            return;
        }
        
        totalTimeInSeconds = totalMinutes * 60;
        intervalTimeInSeconds = intervalMinutes * 60;
        
        // If timer wasn't initialized yet or was reset
        if (remainingTime <= 0) {
            remainingTime = totalTimeInSeconds;
            // Calculate first interval
            if (intervalTimeInSeconds > 0 && intervalTimeInSeconds < totalTimeInSeconds) {
                nextIntervalAt = totalTimeInSeconds - intervalTimeInSeconds;
            } else {
                nextIntervalAt = 0;
            }
        }
        
        isRunning = true;
        timer = setInterval(timerTick, 1000);
        updateDisplay();
    }

    // Pause the timer
    function pauseTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isRunning = false;
    }

    // Reset the timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        remainingTime = 0;
        nextIntervalAt = 0;
        updateDisplay();
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initialize display
    updateDisplay();
}); 