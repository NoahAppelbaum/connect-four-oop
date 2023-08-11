/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const HEIGHT = 7;
const WIDTH = 6;



class Game {
  constructor(height = HEIGHT, width = WIDTH) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.currPlayer = p1; // active player: 1 or 2
    this.gameOver = false;

    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:*/

  makeBoard() {
    //reset JS Board
    if (this.board.length) {
      this.board = [];
    }

    console.log("this at function top: ", this);
    for (let y = 0; y < this.height; y++) {
      console.log("this inside lfoop: ", this);
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');

    //reset existing boards
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      headCell.addEventListener('click', this.handleClick.bind(this));
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }
  // debugger;
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // check for gameOver state
    if (this.gameOver === true) {
      return;
    }
    // debugger;
    // get x from ID of clicked cell
    console.log("event target id: ", evt.target.id);
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.playerNum;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin.call(this)) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.playerNum} won!`);

    }
    // debugger;

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === p1 ? p2 : p1;
  }

  checkForWin() {

    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer.playerNum
      );
    };


    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }


}

class Player {
  constructor(color, playerNum) {
    this.color = color;
    this.playerNum = playerNum;
  }

  /**method to re-assign color from form input */
  reassignColor() {
    let colorInput = document.getElementById(`p${this.playerNum}-color-input`).value;
    if (colorInput) this.color = colorInput;
  }
}

const p1 = new Player("red", 1);
const p2 = new Player("aquamarine", 2);

new Game(6, 7);

let FORM = document.querySelector('form');
FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  p1.reassignColor();
  p2.reassignColor();
  new Game();
});
