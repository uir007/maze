document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const generateButton = document.getElementById('generateButton');
    const cellSize = 20;

    function getRandomInt(max) {
        return Math.floor(max*Math.random())
    }

    generateButton.addEventListener('click', () => {
        const widthInput = document.getElementById('width').value;
        const heightInput = document.getElementById('height').value;
        const cols = parseInt(widthInput, 10);
        const rows = parseInt(heightInput, 10);

        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;
        const maze = Array.from({ length: rows }, () => Array(cols).fill(0));

        function drawMaze() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000';
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (maze[y][x] === 1) {
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                }
            }
        }

        function initializeMaze() {
            for (let z = 1; z < cols-1; z += 2) {
                maze[0][z] = 1;
                maze[rows-1][z] = 1;
            }
            for (let z = 1; z < rows-1; z += 2) {
                maze[z][0] = 1;
                maze[z][cols-1] = 1;
            }
            for (let x = 0; x < rows; x += 2) {
                for (let y = 0; y < cols; y+=2) {
                    maze[x][y] = 1;
                }
            }
            maze[0][1] = 0;
            maze[rows-1][cols-2] = 0;
        }

        // 棒倒し法
        function knockDownWalls() {
            for (let x = 2; x < rows-2; x += 2) {
                for (let y = 2; y < cols-2; y += 2) {
                    const directions = [[x+1,y], [x,y+1]];
                    if (x == 2) directions.push([x-1, y]);
                    if (maze[x][y-1] == 0) directions.push([x, y-1]);
                    const [ny, nx] = directions[getRandomInt(directions.length)];
                    maze[ny][nx] = 1;
                }
            }
        }

        initializeMaze();
        knockDownWalls();
        drawMaze();
        // console.log(maze)
    });

    // ページ読み込み時に自動でボタンをクリック
    generateButton.click();
});
