"use strict"

class Board {
    constructor(nrow, ncol){
        this.nrow = nrow;
        this.ncol = ncol;
        this.maxSteps = nrow * ncol;
        this.grid = new Array(nrow).fill(0).map(_ => new Array(ncol).fill({
            filled: false,
            playerId: null
        }));
    }

    getNextRow(col){
        // if the column is out of range
        if(col < 0 || col >= this.ncol){
            return -1;
        }
        // use binary search to get the empty row
        let start = 0, end = this.nrow - 1;
        while(start + 1 < end){
            let mid = start + Math.floor((end - start)/2);
            if(this.grid[mid][col].filled){
                end = mid;
            }else{
                start = mid;
            }
        }
        if(!this.grid[end][col].filled){
            return end;
        }
        if(!this.grid[start][col].filled){
            return start;
        }
        return -1;
    }

    is4Connected(row, col){
        const playerId = this.grid[row][col].playerId;
        const slopes = [
            [[-1, 0], [1, 0]],
            [[0, -1], [0, 1]],
            [[1, -1], [-1, 1]],
            [[-1, -1], [1, 1]]
        ];
        return slopes.some(directions => {
            const numConnected = directions.reduce((counter, [dx, dy]) => {
                let x = row, y = col;
                while(
                    x + dx >= 0 && x + dx < this.nrow &&
                    y + dy >= 0 && y + dy < this.ncol &&
                    this.grid[x][y].filled && this.grid[x][y].playerId === playerId
                ){
                    x += dx;
                    y += dy;
                    counter++;
                }
                return counter;
            }, 1);
            return numConnected >= 4;
        });
    }

    fill(col, playerId){
        // check if the grid to fill is valid
        const row = this.getNextRow(col);
        if(row === -1){
            return {
                filled: false,
                isFull: false,
                win: false
            };
        }
        // fill the grid
        this.grid[row][col] = {
            filled: true,
            playerId
        };
        // check if the player wins and return
        return {
            filled: true,
            isFull: --this.maxSteps === 0,
            win: this.is4Connected(row, col)
        };
    }
}

class Player {
    constructor(name, id, board){
        this.name = name;
        this.id = id;
        this.board = board;
    }

    play(col){
        return this.board.fill(col, this.id);
    }
}

class Coordinator{
    constructor(nrow, ncol, players){
        this.board = new Board(nrow, ncol);
        this.players = players.map((name, index) => new Player(name, index + 1, this.board));
        this.cursor = 0;
    }

    nextRound(col){
        res = this.players[this.cursor].play(col);
        this.cursor++;
        return res;
    }
}


const n = 2;
const m = 2;
const board = new Board(n, m);
const player_1 = new Player("Victor", 1, board);





console.log(player_1.play(0))
console.log(player_1.play(1))
console.log(player_1.play(1))
console.log(player_1.play(0))

//console.log(board.grid);

