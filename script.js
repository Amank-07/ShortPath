class MazeSolver {
    constructor() {
        this.grid = [];
        this.rows = 10;
        this.cols = 10;
        this.source = null;
        this.destination = null;
        this.isSolving = false;
        this.animationSpeed = 50;
        this.selectionMode = 'source';
        this.currentTheme = 'dark';
        
        this.initializeTheme();
        this.initializeEventListeners();
        this.generateMaze();
        this.updateCurrentModeDisplay();
    }

    initializeTheme() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('mazeSolverTheme') || 'dark';
        this.setTheme(savedTheme);
        
        // Initialize theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('mazeSolverTheme', theme);
        
        // Update theme icon
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    getAnimationSpeed() {
        // Adjust animation speed based on grid size
        const maxDimension = Math.max(this.rows, this.cols);
        if (maxDimension >= 25) return 15; // Fast for very large grids
        if (maxDimension >= 20) return 25; // Medium-fast for large grids
        if (maxDimension >= 15) return 35; // Medium for medium grids
        return 50; // Normal speed for small grids
    }

    initializeEventListeners() {
        document.getElementById('generateMaze').addEventListener('click', () => {
            this.generateMaze();
        });

        document.getElementById('solveMaze').addEventListener('click', () => {
            this.solveMaze();
        });

        // Add event listeners for grid dimensions
        document.getElementById('gridRows').addEventListener('input', () => {
            this.generateMaze();
        });
        
        document.getElementById('gridCols').addEventListener('input', () => {
            this.generateMaze();
        });

        document.getElementById('selectionMode').addEventListener('change', (e) => {
            this.selectionMode = e.target.value;
            this.updateCurrentModeDisplay();
        });

        document.getElementById('runComparison').addEventListener('click', () => {
            this.runAlgorithmComparison();
        });
    }

    generateMaze() {
        this.rows = parseInt(document.getElementById('gridRows').value) || 10;
        this.cols = parseInt(document.getElementById('gridCols').value) || 10;
        
        // Clamp values to reasonable limits
        this.rows = Math.max(5, Math.min(50, this.rows));
        this.cols = Math.max(5, Math.min(50, this.cols));
        
        this.grid = [];
        this.isSolving = false;
        this.source = null;
        this.destination = null;
        
        // Update grid size indicator
        document.getElementById('gridSizeIndicator').textContent = `Grid Size: ${this.rows}×${this.cols}`;
        
        // Initialize grid with walls
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = Math.random() < 0.3 ? 1 : 0; // 30% walls
            }
        }
        
        this.renderGrid();
        this.updateSolveButton();
        this.resetStats();
    }

    renderGrid() {
        const gridContainer = document.getElementById('mazeGrid');
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        
        // Determine cell size based on grid dimensions
        const maxDimension = Math.max(this.rows, this.cols);
        let cellSizeClass = 'cell-extra-large';
        if (maxDimension >= 25) {
            cellSizeClass = 'cell-small';
        } else if (maxDimension >= 20) {
            cellSizeClass = 'cell-medium';
        } else if (maxDimension >= 15) {
            cellSizeClass = 'cell-large';
        } else {
            cellSizeClass = 'cell-extra-large';
        }
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.className = `cell ${cellSizeClass} border-2 border-gray-400 rounded-lg cursor-pointer hover:opacity-80 bg-gray-200 shadow-sm`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.grid[i][j] === 1) {
                    cell.classList.add('wall');
                } else if (this.grid[i][j] === 2) {
                    cell.classList.add('source');
                } else if (this.grid[i][j] === 3) {
                    cell.classList.add('destination');
                }
                
                // Add click event listener
                cell.addEventListener('click', (e) => {
                    this.handleCellClick(i, j);
                });
                
                gridContainer.appendChild(cell);
            }
        }
    }

    resetStats() {
        document.getElementById('currentAlgorithm').textContent = '-';
        document.getElementById('totalDistance').textContent = '-';
        document.getElementById('stepsExplored').textContent = '-';
        document.getElementById('executionTime').textContent = '-';
    }

    handleCellClick(row, col) {
        if (this.isSolving) return;

        switch (this.selectionMode) {
            case 'source':
                this.setSource(row, col);
                break;
            case 'destination':
                this.setDestination(row, col);
                break;
            case 'wall':
                this.toggleWall(row, col);
                break;
        }
    }

    setSource(row, col) {
        // Clear previous source
        if (this.source) {
            this.grid[this.source.row][this.source.col] = 0;
        }
        
        // Set new source
        this.source = { row, col };
        this.grid[row][col] = 2;
        
        this.renderGrid();
        this.updateSolveButton();
    }

    setDestination(row, col) {
        // Clear previous destination
        if (this.destination) {
            this.grid[this.destination.row][this.destination.col] = 0;
        }
        
        // Set new destination
        this.destination = { row, col };
        this.grid[row][col] = 3;
        
        this.renderGrid();
        this.updateSolveButton();
    }

    toggleWall(row, col) {
        // Don't allow toggling source or destination
        if (this.grid[row][col] === 2 || this.grid[row][col] === 3) {
            return;
        }
        
        // Toggle wall
        this.grid[row][col] = this.grid[row][col] === 1 ? 0 : 1;
        
        this.renderGrid();
    }

    updateSolveButton() {
        const solveButton = document.getElementById('solveMaze');
        const comparisonButton = document.getElementById('runComparison');
        const hasSourceAndDest = !!(this.source && this.destination);
        
        solveButton.disabled = !hasSourceAndDest;
        comparisonButton.disabled = !hasSourceAndDest;
        
        // Show comparison section if source and destination are set
        const comparisonSection = document.getElementById('comparisonSection');
        if (hasSourceAndDest) {
            comparisonSection.style.display = 'block';
        } else {
            comparisonSection.style.display = 'none';
        }
    }

    updateCurrentModeDisplay() {
        const modeDisplay = document.getElementById('currentMode');
        const modeText = {
            'source': 'Set Source',
            'destination': 'Set Destination',
            'wall': 'Toggle Wall'
        };
        
        // Remove all mode classes
        modeDisplay.classList.remove('mode-source', 'mode-destination', 'mode-wall');
        
        // Add appropriate class and text
        modeDisplay.textContent = modeText[this.selectionMode];
        modeDisplay.classList.add(`mode-${this.selectionMode}`);
    }

    async solveMaze() {
        if (this.isSolving || !this.source || !this.destination) return;
        
        this.isSolving = true;
        document.getElementById('solveMaze').disabled = true;
        document.getElementById('generateMaze').disabled = true;
        
        const algorithm = document.getElementById('algorithm').value;
        document.getElementById('currentAlgorithm').textContent = 
            algorithm === 'dijkstra' ? "Dijkstra's Algorithm" : "A* Algorithm";
        
        // Reset grid display
        this.renderGrid();
        
        // Start timing
        const startTime = performance.now();
        
        let result;
        if (algorithm === 'dijkstra') {
            result = await this.dijkstra();
        } else {
            result = await this.astar();
        }
        
        // Calculate execution time (excluding animation time)
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(2);
        
        if (result.path.length > 0) {
            await this.animatePath(result.path);
            document.getElementById('totalDistance').textContent = result.distance;
            document.getElementById('stepsExplored').textContent = result.explored;
            document.getElementById('executionTime').textContent = `${executionTime} ms`;
        } else {
            document.getElementById('executionTime').textContent = `${executionTime} ms`;
            alert('No path found! Try adjusting the maze or selecting different source/destination positions.');
        }
        
        this.isSolving = false;
        document.getElementById('solveMaze').disabled = false;
        document.getElementById('generateMaze').disabled = false;
    }

    async dijkstra() {
        const distances = Array(this.rows).fill().map(() => Array(this.cols).fill(Infinity));
        const previous = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        const visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        
        distances[this.source.row][this.source.col] = 0;
        const queue = [{ row: this.source.row, col: this.source.col, distance: 0 }];
        let explored = 0;
        
        while (queue.length > 0) {
            queue.sort((a, b) => a.distance - b.distance);
            const current = queue.shift();
            
            if (visited[current.row][current.col]) continue;
            
            visited[current.row][current.col] = true;
            explored++;
            
            // Animate exploration
            if (this.grid[current.row][current.col] !== 2 && this.grid[current.row][current.col] !== 3) {
                await this.animateCell(current.row, current.col, 'explored');
            }
            
            if (current.row === this.destination.row && current.col === this.destination.col) {
                break;
            }
            
            const neighbors = this.getNeighbors(current.row, current.col);
            for (const neighbor of neighbors) {
                if (!visited[neighbor.row][neighbor.col] && this.grid[neighbor.row][neighbor.col] !== 1) {
                    const newDistance = distances[current.row][current.col] + 1;
                    if (newDistance < distances[neighbor.row][neighbor.col]) {
                        distances[neighbor.row][neighbor.col] = newDistance;
                        previous[neighbor.row][neighbor.col] = current;
                        queue.push({ row: neighbor.row, col: neighbor.col, distance: newDistance });
                    }
                }
            }
        }
        
        const path = this.reconstructPath(previous);
        return { path, distance: path.length - 1, explored };
    }

    async astar() {
        const gScore = Array(this.rows).fill().map(() => Array(this.cols).fill(Infinity));
        const fScore = Array(this.rows).fill().map(() => Array(this.cols).fill(Infinity));
        const previous = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        const visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        
        gScore[this.source.row][this.source.col] = 0;
        fScore[this.source.row][this.source.col] = this.manhattanDistance(this.source, this.destination);
        
        const openSet = [{ row: this.source.row, col: this.source.col, fScore: fScore[this.source.row][this.source.col] }];
        let explored = 0;
        
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.fScore - b.fScore);
            const current = openSet.shift();
            
            if (visited[current.row][current.col]) continue;
            
            visited[current.row][current.col] = true;
            explored++;
            
            // Animate exploration
            if (this.grid[current.row][current.col] !== 2 && this.grid[current.row][current.col] !== 3) {
                await this.animateCell(current.row, current.col, 'explored');
            }
            
            if (current.row === this.destination.row && current.col === this.destination.col) {
                break;
            }
            
            const neighbors = this.getNeighbors(current.row, current.col);
            for (const neighbor of neighbors) {
                if (!visited[neighbor.row][neighbor.col] && this.grid[neighbor.row][neighbor.col] !== 1) {
                    const tentativeGScore = gScore[current.row][current.col] + 1;
                    
                    if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
                        previous[neighbor.row][neighbor.col] = current;
                        gScore[neighbor.row][neighbor.col] = tentativeGScore;
                        fScore[neighbor.row][neighbor.col] = tentativeGScore + this.manhattanDistance(neighbor, this.destination);
                        
                        const existingIndex = openSet.findIndex(node => node.row === neighbor.row && node.col === neighbor.col);
                        if (existingIndex === -1) {
                            openSet.push({ row: neighbor.row, col: neighbor.col, fScore: fScore[neighbor.row][neighbor.col] });
                        } else {
                            // Update existing node's fScore
                            openSet[existingIndex].fScore = fScore[neighbor.row][neighbor.col];
                        }
                    }
                }
            }
        }
        
        const path = this.reconstructPath(previous);
        return { path, distance: path.length - 1, explored };
    }

    manhattanDistance(pos1, pos2) {
        return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
    }

    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
        ];
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                neighbors.push({ row: newRow, col: newCol });
            }
        }
        
        return neighbors;
    }

    reconstructPath(previous) {
        const path = [];
        let current = this.destination;
        
        // Check if destination was reached
        if (previous[current.row][current.col] === null && 
            (current.row !== this.source.row || current.col !== this.source.col)) {
            return []; // No path found
        }
        
        while (current !== null) {
            path.unshift(current);
            current = previous[current.row][current.col];
        }
        
        return path;
    }

    async runAlgorithmComparison() {
        if (this.isSolving || !this.source || !this.destination) return;

        this.isSolving = true;
        document.getElementById('solveMaze').disabled = true;
        document.getElementById('generateMaze').disabled = true;
        document.getElementById('runComparison').disabled = true;

        // Run Dijkstra without animation
        document.getElementById('currentAlgorithm').textContent = "Running Dijkstra's...";
        this.renderGrid();
        
        const dijkstraStart = performance.now();
        const dijkstraResult = await this.dijkstraComparison();
        const dijkstraEnd = performance.now();
        const dijkstraTime = (dijkstraEnd - dijkstraStart).toFixed(2);

        // Update Dijkstra results
        document.getElementById('dijkstraTime').textContent = `${dijkstraTime} ms`;
        document.getElementById('dijkstraSteps').textContent = dijkstraResult.explored;
        document.getElementById('dijkstraDistance').textContent = dijkstraResult.distance;

        // Small delay between algorithms
        await new Promise(resolve => setTimeout(resolve, 500));

        // Run A* without animation
        document.getElementById('currentAlgorithm').textContent = "Running A*...";
        this.renderGrid();
        
        const astarStart = performance.now();
        const astarResult = await this.astarComparison();
        const astarEnd = performance.now();
        const astarTime = (astarEnd - astarStart).toFixed(2);

        // Update A* results
        document.getElementById('astarTime').textContent = `${astarTime} ms`;
        document.getElementById('astarSteps').textContent = astarResult.explored;
        document.getElementById('astarDistance').textContent = astarResult.distance;

        // Show final comparison
        document.getElementById('currentAlgorithm').textContent = "Comparison Complete";
        
        // Highlight the better performing algorithm
        this.highlightBetterAlgorithm(dijkstraTime, astarTime, dijkstraResult.explored, astarResult.explored);

        this.isSolving = false;
        document.getElementById('solveMaze').disabled = false;
        document.getElementById('generateMaze').disabled = false;
        document.getElementById('runComparison').disabled = false;
    }

    highlightBetterAlgorithm(dijkstraTime, astarTime, dijkstraSteps, astarSteps) {
        const dijkstraTimeEl = document.getElementById('dijkstraTime');
        const astarTimeEl = document.getElementById('astarTime');
        const dijkstraStepsEl = document.getElementById('dijkstraSteps');
        const astarStepsEl = document.getElementById('astarSteps');

        // Reset classes
        [dijkstraTimeEl, astarTimeEl, dijkstraStepsEl, astarStepsEl].forEach(el => {
            el.classList.remove('text-green-400', 'text-yellow-400');
            el.classList.add('text-white');
        });

        // Highlight faster algorithm
        if (parseFloat(dijkstraTime) < parseFloat(astarTime)) {
            dijkstraTimeEl.classList.remove('text-white');
            dijkstraTimeEl.classList.add('text-green-400');
        } else if (parseFloat(astarTime) < parseFloat(dijkstraTime)) {
            astarTimeEl.classList.remove('text-white');
            astarTimeEl.classList.add('text-green-400');
        }

        // Highlight algorithm with fewer steps
        if (dijkstraSteps < astarSteps) {
            dijkstraStepsEl.classList.remove('text-white');
            dijkstraStepsEl.classList.add('text-green-400');
        } else if (astarSteps < dijkstraSteps) {
            astarStepsEl.classList.remove('text-white');
            astarStepsEl.classList.add('text-green-400');
        }
    }

    // Dijkstra without animation for comparison
    async dijkstraComparison() {
        const distances = Array(this.rows).fill().map(() => Array(this.cols).fill(Infinity));
        const previous = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        const visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        
        distances[this.source.row][this.source.col] = 0;
        const queue = [{ row: this.source.row, col: this.source.col, distance: 0 }];
        let explored = 0;
        
        while (queue.length > 0) {
            queue.sort((a, b) => a.distance - b.distance);
            const current = queue.shift();
            
            if (visited[current.row][current.col]) continue;
            
            visited[current.row][current.col] = true;
            explored++;
            
            if (current.row === this.destination.row && current.col === this.destination.col) {
                break;
            }
            
            const neighbors = this.getNeighbors(current.row, current.col);
            for (const neighbor of neighbors) {
                if (!visited[neighbor.row][neighbor.col] && this.grid[neighbor.row][neighbor.col] !== 1) {
                    const newDistance = distances[current.row][current.col] + 1;
                    if (newDistance < distances[neighbor.row][neighbor.col]) {
                        distances[neighbor.row][neighbor.col] = newDistance;
                        previous[neighbor.row][neighbor.col] = current;
                        queue.push({ row: neighbor.row, col: neighbor.col, distance: newDistance });
                    }
                }
            }
        }
        
        const path = this.reconstructPath(previous);
        return { path, distance: path.length - 1, explored };
    }

    // A* without animation for comparison
    async astarComparison() {
        const gScore = Array(this.rows).fill().map(() => Array(this.cols).fill(Infinity));
        const fScore = Array(this.rows).fill().map(() => Array(this.cols).fill(Infinity));
        const previous = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        const visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        
        gScore[this.source.row][this.source.col] = 0;
        fScore[this.source.row][this.source.col] = this.manhattanDistance(this.source, this.destination);
        
        const openSet = [{ row: this.source.row, col: this.source.col, fScore: fScore[this.source.row][this.source.col] }];
        let explored = 0;
        
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.fScore - b.fScore);
            const current = openSet.shift();
            
            if (visited[current.row][current.col]) continue;
            
            visited[current.row][current.col] = true;
            explored++;
            
            if (current.row === this.destination.row && current.col === this.destination.col) {
                break;
            }
            
            const neighbors = this.getNeighbors(current.row, current.col);
            for (const neighbor of neighbors) {
                if (!visited[neighbor.row][neighbor.col] && this.grid[neighbor.row][neighbor.col] !== 1) {
                    const tentativeGScore = gScore[current.row][current.col] + 1;
                    
                    if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
                        previous[neighbor.row][neighbor.col] = current;
                        gScore[neighbor.row][neighbor.col] = tentativeGScore;
                        fScore[neighbor.row][neighbor.col] = tentativeGScore + this.manhattanDistance(neighbor, this.destination);
                        
                        const existingIndex = openSet.findIndex(node => node.row === neighbor.row && node.col === neighbor.col);
                        if (existingIndex === -1) {
                            openSet.push({ row: neighbor.row, col: neighbor.col, fScore: fScore[neighbor.row][neighbor.col] });
                        } else {
                            openSet[existingIndex].fScore = fScore[neighbor.row][neighbor.col];
                        }
                    }
                }
            }
        }
        
        const path = this.reconstructPath(previous);
        return { path, distance: path.length - 1, explored };
    }

    async animateCell(row, col, className) {
        const cells = document.querySelectorAll('.cell');
        const index = row * this.cols + col;
        const cell = cells[index];
        
        if (cell) {
            cell.classList.add(className);
            await new Promise(resolve => setTimeout(resolve, this.getAnimationSpeed()));
        }
    }

    async animatePath(path) {
        // Don't animate if path is too short (source and destination are adjacent or same)
        if (path.length <= 2) return;
        
        for (let i = 1; i < path.length - 1; i++) {
            const { row, col } = path[i];
            await this.animateCell(row, col, 'path');
        }
    }

    findPath(start, end) {
        // Simple BFS to check if path exists
        const queue = [start];
        const visited = Array(this.size).fill().map(() => Array(this.size).fill(false));
        const previous = Array(this.size).fill().map(() => Array(this.size).fill(null));
        
        visited[start.row][start.col] = true;
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.row === end.row && current.col === end.col) {
                return this.reconstructPath(previous);
            }
            
            const neighbors = this.getNeighbors(current.row, current.col);
            for (const neighbor of neighbors) {
                if (!visited[neighbor.row][neighbor.col] && this.grid[neighbor.row][neighbor.col] !== 1) {
                    visited[neighbor.row][neighbor.col] = true;
                    previous[neighbor.row][neighbor.col] = current;
                    queue.push(neighbor);
                }
            }
        }
        
        return [];
    }
}

// Initialize the maze solver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MazeSolver();
});
