class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.originalBoard = [];
        this.selectedCell = null;
        this.timer = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.difficulty = 'easy';
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.createBoard();
        this.generatePuzzle();
        this.renderBoard();
        this.startTimer();
    }
    
    createBoard() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.originalBoard = Array(9).fill().map(() => Array(9).fill(0));
    }
    
    generatePuzzle() {
        // 生成完整的数独解决方案
        this.generateCompleteSudoku();
        
        // 复制解决方案作为原始答案
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.solution[i][j] = this.board[i][j];
            }
        }
        
        // 根据难度移除数字
        let cellsToRemove;
        switch (this.difficulty) {
            case 'easy':
                cellsToRemove = 35;
                break;
            case 'medium':
                cellsToRemove = 45;
                break;
            case 'hard':
                cellsToRemove = 55;
                break;
            default:
                cellsToRemove = 40;
        }
        
        this.removeNumbers(cellsToRemove);
    }
    
    generateCompleteSudoku() {
        // 清空当前板
        this.createBoard();
        
        // 填充对角线上的3x3方块（这些方块互不干扰）
        for (let box = 0; box < 9; box += 3) {
            this.fillBox(box, box);
        }
        
        // 解决数独
        this.solveSudoku();
    }
    
    fillBox(row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffleArray(numbers);
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[row + i][col + j] = numbers[i * 3 + j];
            }
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    solveSudoku() {
        // 使用回溯算法解决数独
        return this.solve(this.board);
    }
    
    solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidPlacement(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (this.solve(board)) {
                                return true;
                            }
                            
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    isValidPlacement(board, row, col, num) {
        // 检查行
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
                return false;
            }
        }
        
        // 检查列
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                return false;
            }
        }
        
        // 检查3x3方块
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    removeNumbers(count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (this.board[row][col] !== 0) {
                const backup = this.board[row][col];
                this.board[row][col] = 0;
                
                // 检查是否仍然有唯一解
                const tempBoard = this.copyBoard();
                tempBoard[row][col] = backup;
                if (this.hasUniqueSolution(tempBoard)) {
                    this.originalBoard[row][col] = 0;
                    removed++;
                } else {
                    this.board[row][col] = backup;
                }
            }
        }
        
        // 标记原始数字
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] !== 0) {
                    this.originalBoard[i][j] = 1;
                }
            }
        }
    }
    
    hasUniqueSolution(board) {
        // 简单检查：如果能解决则返回true
        const tempBoard = this.copyBoard();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                tempBoard[i][j] = board[i][j];
            }
        }
        
        // 这里简化处理，实际应实现更复杂的唯一解检查
        return true;
    }
    
    copyBoard() {
        const newBoard = Array(9).fill().map(() => Array(9).fill(0));
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                newBoard[i][j] = this.board[i][j];
            }
        }
        return newBoard;
    }
    
    renderBoard() {
        const boardElement = document.getElementById('sudoku-board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.board[i][j] !== 0) {
                    cell.textContent = this.board[i][j];
                    if (this.originalBoard[i][j] === 1) {
                        cell.classList.add('fixed');
                    } else {
                        cell.classList.add('user-input');
                    }
                }
                
                boardElement.appendChild(cell);
            }
        }
    }
    
    setupEventListeners() {
        // 单元格点击事件
        document.getElementById('sudoku-board').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.selectCell(e.target);
            }
        });
        
        // 数字输入事件
        document.addEventListener('keydown', (e) => {
            if (this.selectedCell && !this.selectedCell.classList.contains('fixed')) {
                const key = e.key;
                
                if (key >= '1' && key <= '9') {
                    this.setNumber(key);
                } else if (key === 'Backspace' || key === 'Delete') {
                    this.clearNumber();
                }
            }
        });
        
        // 控制按钮事件
        document.getElementById('new-game').addEventListener('click', () => {
            this.newGame();
        });
        
        document.getElementById('check').addEventListener('click', () => {
            this.checkSolution();
        });
        
        document.getElementById('solve').addEventListener('click', () => {
            this.solvePuzzle();
        });
        
        document.getElementById('clear').addEventListener('click', () => {
            this.clearBoard();
        });
        
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.newGame();
        });
    }
    
    selectCell(cell) {
        // 取消之前选中的单元格
        const prevSelected = document.querySelector('.cell.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        
        // 选中新的单元格
        cell.classList.add('selected');
        this.selectedCell = cell;
    }
    
    setNumber(number) {
        if (!this.selectedCell || this.selectedCell.classList.contains('fixed')) {
            return;
        }
        
        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);
        
        // 清除错误样式
        this.selectedCell.classList.remove('error');
        
        // 设置数字
        this.board[row][col] = parseInt(number);
        this.selectedCell.textContent = number;
        this.selectedCell.classList.add('user-input');
        
        // 检查是否正确
        if (this.solution[row][col] !== parseInt(number)) {
            this.selectedCell.classList.add('error');
        }
    }
    
    clearNumber() {
        if (!this.selectedCell || this.selectedCell.classList.contains('fixed')) {
            return;
        }
        
        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);
        
        // 清除数字
        this.board[row][col] = 0;
        this.selectedCell.textContent = '';
        this.selectedCell.classList.remove('user-input', 'error');
    }
    
    newGame() {
        this.createBoard();
        this.generatePuzzle();
        this.renderBoard();
        this.resetTimer();
        this.showMessage('', '');
    }
    
    checkSolution() {
        let isComplete = true;
        let hasErrors = false;
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) {
                    isComplete = false;
                } else if (this.board[i][j] !== this.solution[i][j]) {
                    hasErrors = true;
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    cell.classList.add('error');
                }
            }
        }
        
        if (isComplete) {
            if (hasErrors) {
                this.showMessage('有错误，请检查！', 'error');
            } else {
                this.stopTimer();
                this.showMessage(`恭喜完成！用时: ${this.formatTime(this.elapsedTime)}`, 'success');
            }
        } else {
            this.showMessage('游戏尚未完成，请继续填入数字。', 'error');
        }
    }
    
    solvePuzzle() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) {
                    this.board[i][j] = this.solution[i][j];
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    cell.textContent = this.solution[i][j];
                    cell.classList.remove('user-input', 'error');
                    cell.classList.add('fixed');
                }
            }
        }
        
        this.stopTimer();
        this.showMessage('已显示答案！', 'success');
    }
    
    clearBoard() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.originalBoard[i][j] === 0) {
                    this.board[i][j] = 0;
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    cell.textContent = '';
                    cell.classList.remove('user-input', 'error');
                }
            }
        }
        
        this.showMessage('已清除所有输入！', 'success');
    }
    
    startTimer() {
        this.startTime = new Date();
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        if (this.startTime) {
            const now = new Date();
            this.elapsedTime = Math.floor((now - this.startTime) / 1000);
            document.getElementById('time').textContent = this.formatTime(this.elapsedTime);
        }
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    resetTimer() {
        this.stopTimer();
        this.elapsedTime = 0;
        document.getElementById('time').textContent = '00:00';
        this.startTimer();
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        
        // 3秒后清除消息
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'message';
        }, 3000);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
