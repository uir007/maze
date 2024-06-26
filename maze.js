document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const generateButton = document.getElementById('generateButton');
    const solveButton = document.getElementById('solveButton');
    const cellSize = 20;
    let cols, rows; // 幅，高さ
    let maze; // 生成された迷路の構成
    let start_x, start_y, goal_x, goal_y; // スタート，ゴール

    function getRandomInt(max) {
        return Math.floor(max*Math.random());
    }

    function initializeArray(rows, cols, iv=0) {
        return Array.from({ length: rows }, () => Array(cols).fill(iv));
    }

    generateButton.addEventListener('click', () => {
        const widthInput = document.getElementById('width').value;
        const heightInput = document.getElementById('height').value;
        cols = parseInt(widthInput, 10);
        rows = parseInt(heightInput, 10);

        if (cols%2 == 0 || rows%2 == 0) {
            alert("迷路の幅と高さは奇数の必要があります！");
            return;
        }

        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;
        maze = initializeArray(rows, cols);
        start_x = 0; start_y = 1;
        goal_x = rows-1; goal_y = cols-2;

        function drawMaze() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000';
            for (let x = 0; x < rows; x++) {
                for (let y = 0; y < cols; y++) {
                    if (maze[x][y] === 1) {
                        ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
                    }
                }
            }
        }

        // 初期化
        function initializeMaze() {
            for (let z = 0; z < cols; z++) {
                maze[0][z] = 1;
                maze[rows-1][z] = 1;
            }
            for (let z = 0; z < rows; z++) {
                maze[z][0] = 1;
                maze[z][cols-1] = 1;
            }
            maze[start_x][start_y] = 0; // スタート
            maze[goal_x][goal_y] = 0; // ゴール
        }

        // 棒倒し法
        function knockDownWalls() {
            for (let x = 2; x < rows-2; x += 2) {
                for (let y = 2; y < cols-2; y += 2) {
                    const directions = [[x+1,y], [x,y+1]];
                    if (x == 2) directions.push([x-1, y]);
                    if (maze[x][y-1] == 0) directions.push([x, y-1]);
                    const [ny, nx] = directions[getRandomInt(directions.length)];
                    maze[x][y] = 1;
                    maze[ny][nx] = 1;
                }
            }
        }

        initializeMaze();
        knockDownWalls();
        drawMaze();
        // console.log(maze)
    });

    solveButton.addEventListener('click', () => {
        const dist = initializeArray(rows, cols, -1);
        const prev = initializeArray(rows, cols, null);
        const path = [];

        function bfs() {
            const enqueue = [];
            const dequeue = [];
            dist[start_x][start_y] = 0;
            dequeue.push([start_x, start_y]);

            while(enqueue.length + dequeue.length) {
                if (dequeue.length == 0) {
                    while (enqueue.length) {
                        dequeue.push(enqueue.pop());
                    }
                }
                const [a,b] = dequeue.pop();
                const nxt = [[a+1,b], [a-1,b], [a,b+1], [a,b-1]];

                nxt.forEach(([x,y]) => {
                    if (0 <= x && x < rows && 0 <= y && y < cols && maze[x][y] == 0 && dist[x][y] == -1) {
                        dist[x][y] = dist[a][b] + 1;
                        prev[x][y] = [a,b];
                        enqueue.push([x,y]);
                    }
                });
            }
        }

        function constructPath() {
            let x = goal_x; let y = goal_y;
            while (prev[x][y] !== null) {
                path.push([x,y]);
                [x,y] = prev[x][y];
            }
            path.push([start_x, start_y]);
        }

        function drawPath() {
            ctx.fillStyle = '#999';
            path.forEach(([x,y]) => {
                ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
            });
        }

        bfs();
        constructPath();
        drawPath();
    });

    // ページ読み込み時に自動でボタンをクリック
    generateButton.click();
});
