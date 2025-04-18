document.addEventListener('DOMContentLoaded', () => {
    const modeSelection = document.getElementById('mode-selection');
    const symbolSelection = document.getElementById('symbol-selection');
    const gameContent = document.getElementById('game-content');
    const pvpButton = document.getElementById('pvp');
    const pvcButton = document.getElementById('pvc');
    const chooseXButton = document.getElementById('choose-x');
    const chooseOButton = document.getElementById('choose-o');
    const backButton = document.getElementById('back-btn');
    const backToModeButton = document.getElementById('back-to-mode');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let isAiMode = false;
    let playerSymbol = 'X';
    let aiSymbol = 'O';
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];
    
    const startGame = (mode) => {
        isAiMode = mode === 'pvc';
        if (isAiMode) {
            modeSelection.classList.add('hidden');
            symbolSelection.classList.remove('hidden');
        } else {
            modeSelection.classList.add('hidden');
            gameContent.classList.remove('hidden');
            resetGame();
        }
    };
    
    const selectSymbol = (symbol) => {
        playerSymbol = symbol;
        aiSymbol = symbol === 'X' ? 'O' : 'X';
        currentPlayer = 'X'; // X always starts
        symbolSelection.classList.add('hidden');
        gameContent.classList.remove('hidden');
        resetGame();
    };
    
    const goBack = () => {
        gameContent.classList.add('hidden');
        modeSelection.classList.remove('hidden');
        resetGame();
    };
    
    const goBackToMode = () => {
        symbolSelection.classList.add('hidden');
        modeSelection.classList.remove('hidden');
    };
    
    const makeAiMove = () => {
        if (!gameActive || currentPlayer !== aiSymbol) return;
        
        let move = findWinningMove(aiSymbol) || 
                  findWinningMove(playerSymbol) || 
                  (gameState[4] === '' ? 4 : null) || 
                  findRandomMove();
        
        if (move !== null) {
            setTimeout(() => {
                const cell = cells[move];
                cell.click();
            }, 500);
        }
    };
    
    const findWinningMove = (symbol) => {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] === symbol && gameState[b] === symbol && gameState[c] === '') return c;
            if (gameState[a] === symbol && gameState[c] === symbol && gameState[b] === '') return b;
            if (gameState[b] === symbol && gameState[c] === symbol && gameState[a] === '') return a;
        }
        return null;
    };
    
    const findRandomMove = () => {
        const availableMoves = gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        return availableMoves.length > 0 ? 
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : 
            null;
    };
    
    const highlightWinningCells = (winningCondition) => {
        winningCondition.forEach(index => {
            cells[index].classList.add('winning');
        });
    };
    
    const handleCellClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute('data-index');
        
        if (gameState[index] !== '' || !gameActive) {
            return;
        }
        
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        const winningCondition = checkWin();
        if (winningCondition) {
            status.classList.add('win');
            const winner = isAiMode ? 
                (currentPlayer === playerSymbol ? 'You' : 'Computer') : 
                `Player ${currentPlayer}`;
            status.textContent = `${winner} wins!`;
            gameActive = false;
            highlightWinningCells(winningCondition);
            return;
        }
        
        if (checkDraw()) {
            status.classList.add('draw');
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = isAiMode ? 
            (currentPlayer === playerSymbol ? 'Your turn' : 'Computer\'s turn') : 
            `Player ${currentPlayer}'s turn`;
        
        if (isAiMode && currentPlayer === aiSymbol) {
            makeAiMove();
        }
    };
    
    const checkWin = () => {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] !== '' && 
                gameState[a] === gameState[b] && 
                gameState[a] === gameState[c]) {
                return [a, b, c];
            }
        }
        return null;
    };
    
    const checkDraw = () => {
        return gameState.every(cell => cell !== '');
    };
    
    const resetGame = () => {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = isAiMode ? 
            (currentPlayer === playerSymbol ? 'Your turn' : 'Computer\'s turn') : 
            `Player ${currentPlayer}'s turn`;
        status.classList.remove('win', 'draw');
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
        
        if (isAiMode && currentPlayer === aiSymbol) {
            makeAiMove();
        }
    };
    
    pvpButton.addEventListener('click', () => startGame('pvp'));
    pvcButton.addEventListener('click', () => startGame('pvc'));
    chooseXButton.addEventListener('click', () => selectSymbol('X'));
    chooseOButton.addEventListener('click', () => selectSymbol('O'));
    backButton.addEventListener('click', goBack);
    backToModeButton.addEventListener('click', goBackToMode);
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', resetGame);
}); 
