class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(value, priority) {
        const node = { value, priority };
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    dequeue() {
        const min = this.heap[0];
        const end = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return min.value;
    }

    bubbleUp(index) {
        const node = this.heap[index];

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];

            if (node.priority >= parent.priority) break;

            this.heap[parentIndex] = node;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        const length = this.heap.length;
        const node = this.heap[index];

        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild.priority < node.priority) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.priority < node.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;

            this.heap[index] = this.heap[swap];
            this.heap[swap] = node;
            index = swap;
        }
    }

    get size() {
        return this.heap.length;
    }

    get isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        if (this.isEmpty) return null;
        return this.heap[0];
    }

    size() {
        return this.heap.length
    }
}

class Grid {
    constructor(rows, cols, factory = ()=>{return 0}) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(factory());
            }
            this.grid.push(row);
        }
    }

    get(row, col) {
        if (this.isValid(row, col)) {
            return this.grid[row][col];
        }
        return null;
    }

    set(row, col, value) {
        if (this.isValid(row, col)) {
            this.grid[row][col] = value;
        }
    }

    isValid(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    forEach(callback) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                callback(this.grid[row][col], row, col);
            }
        }
    }

    map(fn) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col]=fn(this.grid[row][col], row, col);
            }
        }
    }
}

class Cell{
    constructor(){
        this.type = "empty"
        this.color = "#FFFFFF"
        this.distance = 0
    }

    set_type(type){
        colorMode(HSB)
        let type_colors = {
            "empty":"#FFFFFF",
            "source":"#6AE6DF",
            "wall": "#E67A75",
            "obstacle": "#FF0000",
            "exit": "#98E681",
            "show_dist": lerpColor(color("#0099FF"), color("#FF0000"), this.distance/150),
            "path": "#F7D354"
        }

        this.type = type
        this.color = type_colors[type]
    }
}

function make_button(couleur, text, event) {
    temp = createDiv(text);
    temp.style("width", "max-content")
    temp.style("height", "min-content")
    temp.style("border-radius", "10px")
    temp.style("padding", "5px");
    temp.style("background-color", couleur);
    temp.style("cursor", "pointer");
    temp.parent("bar")
    temp.attribute("onclick", event)
    return temp;
}

function make_topbar(cellSize , topBarHeight, nbCellsHorizontal, nbCellsVertical){
    background(68);
    noStroke();
    fill(68);
    rect(0, topBarHeight, nbCellsHorizontal * cellSize, nbCellsVertical * cellSize + topBarHeight)
    bar = createDiv();
    bar.style("width", "100%");
    bar.style("height", String(topBarHeight) + "px");
    bar.position(0, 0)
    bar.id("bar")
    bar.style("display", "flex")
    bar.style("justify-content", "space-around")
    bar.style("align-items", "center")
    bar.style("flex-wrap", "wrap")
    backArrow = make_button("#ffffff", "↩ retour", "history.back()")
    source = make_button("#6AE6DF", "source", "selected = 'source'");
    mur = make_button("#E67A75", "mur", "selected = 'wall'");
    obstacle = make_button("#FF0000", "obstacle", "selected = 'obstacle'")
    sortie = make_button("#98E681", "sortie", "selected = 'exit'");
    effacer = make_button("#FFFFFF", "effacer", "selected = 'empty'");
    // resetB = make_button("#B35C54", "reset", "HardReset()");
    searchB = make_button("#BF7DF0", "chercher", "dijkstra()");
    unsearchB = make_button("#9565B9", "arrêter", "stopSearch()");
    unsearchB.style("display", "none")
    return bar
}

function make_base_cell(){
    return new Cell()
}

function displayGrid(grid) {
    grid.forEach((value, row, col) => {
        fill(value.color)
        square(row * cellSize + 1, col * cellSize + 1 + topBarHeight, cellSize - 2);
    })
}

function setup() {
    cellSize = 20;
    topBarHeight = 50;
    nbCellsVertical = floor((windowHeight - topBarHeight) / cellSize);
    nbCellsHorizontal = floor(windowWidth / cellSize)
    createCanvas(nbCellsHorizontal * cellSize, nbCellsVertical * cellSize + topBarHeight);
    bar = make_topbar(cellSize , topBarHeight, nbCellsHorizontal, nbCellsVertical)
    selected = 0
    grid = new Grid(nbCellsHorizontal, nbCellsVertical, make_base_cell)
    speed = 10
}

// function HardReset() {
//     bar.remove()
//     setup()
// }

function draw() {
    if (mouseIsPressed) {
        var x = floor(mouseX / cellSize)
        var y = floor((mouseY - topBarHeight) / cellSize)
        try { grid.get(x,y).set_type(selected) } catch (err) { /*console.log(`didn't set type <${selected}> of cell (${x}, ${y})`); console.log(err)*/ }
    }
    displayGrid(grid)
}

function dijkstra() {
    starts = new PriorityQueue()
    noLoop()
    searchB.style("display", "none")
    unsearchB.style("display", "block")
    grid.forEach((value, row, col) => {value.x = row; value.y = col; if (value.type === "source"){starts.enqueue(value, value.distance)}})
    // console.log(starts)
    found = false
    intvlID = setInterval(
        function () {
            // currEnd = starts.size()
            // for (var index = 0; index < currEnd; index++) {
            item = starts.dequeue()
            if (item.type === "empty" || item.type === "obstacle"){
                item.set_type("show_dist")
            } else if (item.type === "exit"){
                found = item
            } else if (item.type !== "source"){
                // continue
                return
            } 
            x = item.x
            y = item.y
            // console.log(x,y,starts.heap)
            lx = [x + 1, x - 1, x, x]
            ly = [y, y, y + 1, y - 1]
            for (var delta = 0; delta < 4; delta++) {
                dx = lx[delta]
                dy = ly[delta]
                if (!grid.isValid(dx, dy)) { continue }
                if (grid.get(dx, dy).type === "empty" || grid.get(dx, dy).type === "exit") {
                    if (grid.get(dx, dy).distance === 0){
                        grid.get(dx, dy).distance = grid.get(x, y).distance+1
                        grid.get(dx, dy).parent = grid.get(x, y)
                    } else if (grid.get(dx, dy).distance > grid.get(x, y).distance+1){
                        grid.get(dx, dy).distance = grid.get(x, y).distance+1
                        grid.get(dx, dy).parent = grid.get(x, y)
                    } else {
                        continue
                    }
                    starts.enqueue(grid.get(dx, dy), grid.get(dx, dy).distance)
                } else if (grid.get(dx, dy).type === "obstacle") {
                    if (grid.get(dx, dy).distance === 0){
                        grid.get(dx, dy).distance = grid.get(x, y).distance+5
                        grid.get(dx, dy).parent = grid.get(x, y)
                    } else if (grid.get(dx, dy).distance > grid.get(x, y).distance+5){
                        grid.get(dx, dy).distance = grid.get(x, y).distance+5
                        grid.get(dx, dy).parent = grid.get(x, y)
                    } else {
                        continue
                    }
                    starts.enqueue(grid.get(dx, dy), grid.get(dx, dy).distance)
                }
            }
            // }
            displayGrid(grid)

            if (found) {
                // console.log(grid)
                clearInterval(intvlID)
                backtrack(found)
            }
        }, speed);
}

function backtrack(cell) {
    intvlID2 = setInterval(
        function () {
            if (cell.parent === undefined) {
                clearInterval(intvlID2)
                stopSearch()
            }
            cell.set_type("path")
            cell = cell.parent
            displayGrid(grid)
        }, speed)
}

function stopSearch() {
    clearInterval(intvlID)
    loop()
    unsearchB.style("display", "none")
    searchB.style("display", "block")
}
