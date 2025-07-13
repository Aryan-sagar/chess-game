const initialBoard = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

let boardState = JSON.parse(JSON.stringify(initialBoard));
let currentTurn = "white";
let selected = null;
let gameOver = false;

function renderBoard() {
  const board = document.getElementById("chessboard");
  board.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "white" : "black");

      square.textContent = boardState[row][col];
      square.addEventListener("click", () => handleSquareClick(row, col));

      board.appendChild(square);
    }
  }
}
let castlingRights = {
  whiteKingMoved: false,
  whiteRookLeftMoved: false,
  whiteRookRightMoved: false,
  blackKingMoved: false,
  blackRookLeftMoved: false,
  blackRookRightMoved: false
};
let enPassantTarget = null;


function handleSquareClick(row, col) {
  if (gameOver) return;

  const piece = boardState[row][col];

  if (currentTurn === "white") {
    if (selected) {
      const moves = getPossibleMoves(pieceType(selected.row, selected.col), selected.row, selected.col, boardState, "white");

      const valid = moves.some(([r, c]) => r === row && c === col);
      if (valid) {
        movePiece(selected.row, selected.col, row, col);
        checkWin();

        if (isKingInCheck(currentTurn)) {
  document.getElementById("game-status").textContent = `${currentTurn} is in check!`;
}
if (isCheckmate(currentTurn)) {
  document.getElementById("game-status").textContent = `${currentTurn} is in checkmate!`;
  alert(`🏁 ${currentTurn} is checkmated!`);
  gameOver = true;
  return;
}

        if (gameOver) return;
        currentTurn = "black";
        selected = null;
        renderBoard();
        setTimeout(computerMove, 300);
      } else {
        selected = null;
      }
    } else if (isWhitePiece(piece)) {
      selected = { row, col };
    }
  }
}

function computerMove() {
  if (gameOver) return;

  let allMoves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (piece !== "" && !isWhitePiece(piece)) {
        const type = pieceType(r, c);
        const moves = getSafeMoves(type, r, c, boardState, "black");

        for (let [tr, tc] of moves) {
          allMoves.push({ from: [r, c], to: [tr, tc], target: boardState[tr][tc] });
        }
      }
    }
  }

  // Prioritize capturing moves
  const captures = allMoves.filter(m => m.target !== "");
  const move = captures.length > 0
    ? captures[Math.floor(Math.random() * captures.length)]
    : allMoves[Math.floor(Math.random() * allMoves.length)];

  if (!move) {
    document.getElementById("game-status").textContent = `Black has no moves. Stalemate!`;
    gameOver = true;
    return;
  }

  movePiece(...move.from, ...move.to);
  currentTurn = "white";
  renderBoard();
  checkWin();

  if (isKingInCheck(currentTurn)) {
    document.getElementById("game-status").textContent = `${currentTurn} is in check!`;
  }

  if (isCheckmate(currentTurn)) {
    document.getElementById("game-status").textContent = `${currentTurn} is in checkmate!`;
    alert(`🏁 ${currentTurn} is checkmated!`);
    gameOver = true;
  }
}


function movePiece(fr, fc, tr, tc) {
  boardState[tr][tc] = boardState[fr][fc];
  boardState[fr][fc] = "";
}

function pieceType(row, col) {
  const piece = boardState[row][col];
  const map = {
    "♙": "pawn", "♖": "rook", "♘": "knight", "♗": "bishop",
    "♕": "queen", "♔": "king",
    "♟": "pawn", "♜": "rook", "♞": "knight", "♝": "bishop",
    "♛": "queen", "♚": "king"
  };
  return map[piece] || null;
}

function isWhitePiece(piece) {
  return ["♙", "♖", "♘", "♗", "♕", "♔"].includes(piece);
}

function isOpponent(piece, color) {
  if (piece === "") return false;
  const isWhite = isWhitePiece(piece);
  return (color === "white" && !isWhite) || (color === "black" && isWhite);
}

function createEmptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(""));
}
function movePiece(fr, fc, tr, tc) {
  const piece = boardState[fr][fc];

  // Track castling rights
  if (piece === "♔") castlingRights.whiteKingMoved = true;
  if (piece === "♖" && fr === 7 && fc === 0) castlingRights.whiteRookLeftMoved = true;
  if (piece === "♖" && fr === 7 && fc === 7) castlingRights.whiteRookRightMoved = true;

  if (piece === "♚") castlingRights.blackKingMoved = true;
  if (piece === "♜" && fr === 0 && fc === 0) castlingRights.blackRookLeftMoved = true;
  if (piece === "♜" && fr === 0 && fc === 7) castlingRights.blackRookRightMoved = true;

  // Castling logic
  if (piece === "♔" && fr === 7 && fc === 4 && tr === 7 && (tc === 6 || tc === 2)) {
    if (tc === 6) {
      boardState[7][5] = boardState[7][7];
      boardState[7][7] = "";
    } else if (tc === 2) {
      boardState[7][3] = boardState[7][0];
      boardState[7][0] = "";
    }
  }

  if (piece === "♚" && fr === 0 && fc === 4 && tr === 0 && (tc === 6 || tc === 2)) {
    if (tc === 6) {
      boardState[0][5] = boardState[0][7];
      boardState[0][7] = "";
    } else if (tc === 2) {
      boardState[0][3] = boardState[0][0];
      boardState[0][0] = "";
    }
  }

  // En passant capture
  if (piece === "♙" && tr === enPassantTarget?.[0] && tc === enPassantTarget?.[1]) {
    boardState[tr + 1][tc] = "";
  }
  if (piece === "♟" && tr === enPassantTarget?.[0] && tc === enPassantTarget?.[1]) {
    boardState[tr - 1][tc] = "";
  }

  boardState[tr][tc] = piece;
  boardState[fr][fc] = "";

  // Promotion
  if (piece === "♙" && tr === 0) {
    boardState[tr][tc] = "♕"; // white queen
  }
  if (piece === "♟" && tr === 7) {
    boardState[tr][tc] = "♛"; // black queen
  }

  // Set enPassantTarget
  if (piece === "♙" && fr === 6 && tr === 4) {
    enPassantTarget = [5, fc];
  } else if (piece === "♟" && fr === 1 && tr === 3) {
    enPassantTarget = [2, fc];
  } else {
    enPassantTarget = null;
  }
}


// Only pawn logic for now
function getPossibleMoves(type, row, col, board, color) {
  const moves = [];
  if (type === "pawn") {
    const dir = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;

    if (board[row + dir]?.[col] === "") {
      moves.push([row + dir, col]);

      if (row === startRow && board[row + 2 * dir]?.[col] === "") {
        moves.push([row + 2 * dir, col]);
      }
    }

    for (let d of [-1, 1]) {
      const newCol = col + d;
      if (newCol >= 0 && newCol < 8) {
        const target = board[row + dir]?.[newCol];
        if (target && isOpponent(target, color)) {
          moves.push([row + dir, newCol]);


        }
      }
    }
  }
       if (type === "knight") {
    const jumps = [
      [-2, -1], [-2, 1],
      [-1, -2], [-1, 2],
      [1, -2], [1, 2],
      [2, -1], [2, 1]
    ];

    for (const [dr, dc] of jumps) {
      const r = row + dr;
      const c = col + dc;

      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target === "" || isOpponent(target, color)) {
          moves.push([r, c]);
        }
      }
    }
  }
  if (type === "rook") {
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1]   // right
    ];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target === "") {
          moves.push([r, c]);
        } else {
          if (isOpponent(target, color)) {
            moves.push([r, c]);
          }
          break; // stop after hitting any piece
        }
        r += dr;
        c += dc;
      }
    }
  }
  
    if (type === "bishop") {
    const directions = [
      [-1, -1], [-1, 1], // top-left, top-right
      [1, -1],  [1, 1]   // bottom-left, bottom-right
    ];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target === "") {
          moves.push([r, c]);
        } else {
          if (isOpponent(target, color)) {
            moves.push([r, c]);
          }
          break; // friendly or enemy piece stops path
        }
        r += dr;
        c += dc;
      }
    }
  }
  if (type === "queen") {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],     // Rook-like
      [-1, -1], [-1, 1], [1, -1], [1, 1]    // Bishop-like
    ];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target === "") {
          moves.push([r, c]);
        } else {
          if (isOpponent(target, color)) {
            moves.push([r, c]);
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
  }
   if (type === "king") {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;

    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (target === "" || isOpponent(target, color)) {
        moves.push([r, c]);
      }
    }
  }

  //  Castling
  if (color === "white" && row === 7 && col === 4 && !castlingRights.whiteKingMoved && !isKingInCheck("white")) {
    // White kingside (O-O)
    if (
      !castlingRights.whiteRookRightMoved &&
      board[7][5] === "" &&
      board[7][6] === ""
    ) {
      // simulate king step over f1
      const backup = JSON.parse(JSON.stringify(boardState));
      movePiece(7, 4, 7, 5);
      const inCheck = isKingInCheck("white");
      boardState = backup;
      if (!inCheck) {
        moves.push([7, 6]);
      }
    }

    // White queenside (O-O-O)
    if (
      !castlingRights.whiteRookLeftMoved &&
      board[7][1] === "" &&
      board[7][2] === "" &&
      board[7][3] === ""
    ) {
      const backup = JSON.parse(JSON.stringify(boardState));
      movePiece(7, 4, 7, 3);
      const inCheck = isKingInCheck("white");
      boardState = backup;
      if (!inCheck) {
        moves.push([7, 2]);
      }
    }
  }

  if (color === "black" && row === 0 && col === 4 && !castlingRights.blackKingMoved && !isKingInCheck("black")) {
    // Black kingside (O-O)
    if (
      !castlingRights.blackRookRightMoved &&
      board[0][5] === "" &&
      board[0][6] === ""
    ) {
      const backup = JSON.parse(JSON.stringify(boardState));
      movePiece(0, 4, 0, 5);
      const inCheck = isKingInCheck("black");
      boardState = backup;
      if (!inCheck) {
        moves.push([0, 6]);
      }
    }

    // Black queenside (O-O-O)
    if (
      !castlingRights.blackRookLeftMoved &&
      board[0][1] === "" &&
      board[0][2] === "" &&
      board[0][3] === ""
    ) {
      const backup = JSON.parse(JSON.stringify(boardState));
      movePiece(0, 4, 0, 3);
      const inCheck = isKingInCheck("black");
      boardState = backup;
      if (!inCheck) {
        moves.push([0, 2]);
      }
    }
  }
}


  return moves;
}

function checkWin() {
  let hasWhiteKing = false;
  let hasBlackKing = false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (boardState[row][col] === "♔") hasWhiteKing = true;
      if (boardState[row][col] === "♚") hasBlackKing = true;
    }
  }

  if (!hasWhiteKing || !hasBlackKing) {
    const winner = hasWhiteKing ? "White" : "Black";
    document.getElementById("game-status").textContent = `${winner} wins the game!`;
    alert(`🏁 ${winner} wins!`);
    gameOver = true;
  }
}

renderBoard();
let legalMoves = []; // Highlighted legal moves for selected piece


square.classList.add((row + col) % 2 === 0 ? "white" : "black");

// Highlight if in legalMoves
if (legalMoves.some(([r, c]) => r === row && c === col)) {
  square.classList.add("highlight");
}
function handleSquareClick(row, col) {
  if (gameOver) return;

  const piece = boardState[row][col];

  if (currentTurn === "white") {
    if (selected) {
      const valid = legalMoves.some(([r, c]) => r === row && c === col);
      if (valid) {
        movePiece(selected.row, selected.col, row, col);
        checkWin();
        if (gameOver) return;
        currentTurn = "black";
        selected = null;
        legalMoves = [];
        renderBoard();
        setTimeout(computerMove, 300);
      } else {
        selected = null;
        legalMoves = [];
        renderBoard();
      }
    } else if (isWhitePiece(piece)) {
      selected = { row, col };
      legalMoves = getSafeMoves(pieceType(row, col), row, col, boardState, currentTurn);

      renderBoard();
    }
  }
}
function restartGame() {
  boardState = JSON.parse(JSON.stringify(initialBoard));
  currentTurn = "white";
  selected = null;
  legalMoves = [];
  gameOver = false;
  document.getElementById("game-status").textContent = "";
  renderBoard();
}
function findKing(color) {
  const kingSymbol = color === "white" ? "♔" : "♚";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (boardState[r][c] === kingSymbol) return [r, c];
    }
  }
  return null;
}
function isKingInCheck(color, board = boardState) {
  const [kr, kc] = findKing(color, board);
  const enemyColor = color === "white" ? "black" : "white";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece !== "" && isOpponent(piece, color)) {
        const type = pieceType(r, c);
        const enemyMoves = getPossibleMoves(type, r, c, board, enemyColor);  // ✅ not getSafeMoves!
        if (enemyMoves.some(([tr, tc]) => tr === kr && tc === kc)) {
          return true;
        }
      }
    }
  }

  return false;
}

function isCheckmate(color) {
  if (!isKingInCheck(color)) return false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (piece !== "" && ((color === "white" && isWhitePiece(piece)) || (color === "black" && !isWhitePiece(piece)))) {
        const type = pieceType(r, c);
        const moves = getPossibleMoves(type, r, c, boardState, color);

        for (let [tr, tc] of moves) {
          const backup = JSON.parse(JSON.stringify(boardState));
          movePiece(r, c, tr, tc);
          const stillInCheck = isKingInCheck(color);
          boardState = backup;

          if (!stillInCheck) return false;
        }
      }
    }
  }

  return true;
}
function getSafeMoves(type, row, col, board, color) {
  const moves = getPossibleMoves(type, row, col, board, color);
  const safeMoves = [];

  for (let [tr, tc] of moves) {
    const backup = JSON.parse(JSON.stringify(boardState));
    movePiece(row, col, tr, tc);
    const stillInCheck = isKingInCheck(color); // ✅ OK here
    boardState = backup;

    if (!stillInCheck) {
      safeMoves.push([tr, tc]);
    }
  }

  return safeMoves;
}

