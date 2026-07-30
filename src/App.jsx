import {useState} from 'react';

export default function Game () {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending,setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let content;
    let order;
    if (move === currentMove) {
      content = move > 0 ? "Estas en el movimiento #" + move : "Estas en el inicio del juego";
    } else {
      const description = move > 0 ? "Ir al movimiento #" + move : "Ir al inicio del juego";
      content = <button onClick={() => jumpTo(move)}>{description}</button>
    }

    return (
        <li key={move}>
          {content}
        </li>
    );
  });

  if(!isAscending){
    moves.reverse();
  }

  return (
  <div className="game">
    <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
    </div>
    <div className="game-info">
      <button onClick={() => setIsAscending(!isAscending)}>{isAscending ? "Ordenar descendente" : "Ordenar Ascendente"}</button>

      <ol>{moves}</ol>
    </div>
  </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Ganador: ' + winner.player;
  } else {
    status = 'Siguiente Jugador: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++){
    const rowSquares = [];
    for (let col = 0; col <3; col++){
      const squareIndex = row * 3 + col;
      const isWinningSquare = winner && winner.line.includes(squareIndex);
      rowSquares.push(
        <Square
        key={squareIndex}
        value={squares[squareIndex]}
        onSquareClick={() => handleClick(squareIndex)}
        isWinningSquare={isWinningSquare}
        />
      );
    }
    boardRows.push(
      <div key={row} className='board-row'>
        {rowSquares}
      </div>
    )
  }

  return (
  <div>
    <div className="status">{status}</div>
    {boardRows}
  </div>
  )
}

function Square({value, onSquareClick, isWinningSquare}) {
  const className = `square ${isWinningSquare ? 'winning' : ''}`;
  return <button className={className} onClick={onSquareClick}>{value}</button>
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return{
        player: squares[a],
        line: lines[i]
      }; 
    }
  }
  return null;
}