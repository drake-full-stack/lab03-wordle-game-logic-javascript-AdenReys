// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

// TODO: Add keyboard event listener
document.addEventListener('keydown', function(event) {
    if (gameOver) return; // Ignore input if game is over
    const key = event.key.toUpperCase();
    if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (key === 'ENTER') {
        submitGuess();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
});

// TODO: Implement addLetter function
function addLetter(letter) {
    if (currentTile >= 5) {
        logDebug("⚠️ Row is full! Press Enter to submit or Backspace to delete.", 'warning');
        return;
    }
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    tiles[currentTile].textContent = letter;
    currentTile++;
    logDebug(`Added letter: ${letter} at position ${currentTile - 1}`, 'info');
}

// TODO: Implement deleteLetter function  
function deleteLetter() {
    if (currentTile <= 0){
        logDebug("⚠️ Row is Empty! Press Enter a letter to delete.", 'warning');
        return;
    }
    currentTile--;
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll(".tile");
    const tileToDelete = tiles[currentTile];
    const letterBeingDeleted = tileToDelete.textContent;

    tileToDelete.textContent = "";
    tileToDelete.classList.remove("filled");
    logDebug(`Deleted letter: ${letterBeingDeleted} from position ${currentTile}`, 'info');
}

// TODO: Implement submitGuess function
function submitGuess() {
    logDebug(`📝 submitGuess() called`, 'info');

    // Check if row has exactly 5 letters
    if (currentTile !== 5) {
        logDebug("Please enter 5 letters!", 'warning');
        return;
    }

    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let guess = '';
    tiles.forEach(tile => {
        guess += tile.textContent;
    });

    logDebug(`Guess word: ${guess} - Target word: ${TARGET_WORD}`, 'info');

    // Call checkGuess (to be implemented)
    checkGuess(guess, tiles);

    // Check win condition
    if (guess === TARGET_WORD) {
        gameOver = true;
        logDebug(`🎉 YOU WON!`, 'success');
        setTimeout(() => alert("Congratulations! You guessed the word!"), 100);
        return;
    }

    // Move to next row
    currentRow++;
    currentTile = 0;

    // Check lose condition
    if (currentRow >= 6) {
        gameOver = true;
        logDebug(`😢 YOU LOSE! The word was ${TARGET_WORD}.`, 'warning');
        setTimeout(() => alert(`Game Over! The word was: ${TARGET_WORD}`), 100);
    }
}

// TODO: Implement checkGuess function (the hardest part!)
function checkGuess(guess, tiles) {
    logDebug(`🔍 Starting analysis for "${guess}"`, 'info');
    
    // TODO: Split TARGET_WORD and guess into arrays
    const target = TARGET_WORD.split('');
    const guessArray = guess.split('');
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    
    // STEP 1: Find exact matches
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = 'correct';
            // TODO: mark both target[i] and guessArray[i] as used (null)
            target[i] = null;
            guessArray[i] = null;
            logDebug(`Letter ${guess[i]} at position ${i} is correct`, 'info');
        }
    }
    
    // STEP 2: Find wrong position matches  
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== null) { // only check unused letters
            // TODO: look for guessArray[i] in remaining target letters
            const indexInTarget = target.indexOf(guessArray[i]);
            // TODO: if found, mark as 'present' and set target position to null
            if (indexInTarget !== -1) {
                result[i] = 'present';
                target[indexInTarget] = null;
                logDebug(`Letter ${guessArray[i]} at position ${i} is present`, 'info');
            }
        }
    }
    
    // TODO: Apply CSS classes to tiles -- we'll do this in the next step
    for (let i = 0; i < 5; i++) {
        tiles[i].classList.add(result[i]);
    }
    return result;
}