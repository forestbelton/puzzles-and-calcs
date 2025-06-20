import { ChangeEvent, useState, MouseEvent } from "react";
import memoizedPuzzle from "./memoized-switch-puzzles.json";

type PuzzleMove = {
  xy: number[] | null;
  steps: number;
};

const ALL_PUZZLE_MOVES: Record<string, PuzzleMove> = memoizedPuzzle;

enum Mode {
  EDITING = "EDITING",
  SOLVING = "SOLVING",
}

type BoardCell = 0 | 1;

type BoardRow = [BoardCell, BoardCell, BoardCell];

type Board = [BoardRow, BoardRow, BoardRow];

const EMPTY_BOARD: Board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const encode = (board: Board): number => {
  let out = 0;
  for (let y = 2; y >= 0; y--) {
    for (let x = 2; x >= 0; x--) {
      out = (out << 1) | board[y][x];
    }
  }
  return out;
};

const toggle = (
  board: Board,
  x: number,
  y: number,
  neighbors: boolean = false
): Board => {
  const newBoard: Board = [[...board[0]], [...board[1]], [...board[2]]];
  if (!neighbors) {
    newBoard[y][x] = (1 - newBoard[y][x]) as BoardCell;
    return newBoard;
  }
  for (let y1 = 0; y1 <= 2; y1++) {
    for (let x1 = 0; x1 <= 2; x1++) {
      newBoard[y1][x1] = isNeighbor(x, y, x1, y1)
        ? ((1 - newBoard[y1][x1]) as BoardCell)
        : newBoard[y1][x1];
    }
  }
  return newBoard;
};

const isNeighbor = (x0: number, y0: number, x1: number, y1: number): boolean =>
  (x0 == x1 && Math.abs(y0 - y1) <= 1) || (y0 == y1 && Math.abs(x0 - x1) <= 1);

const SwitchPage = () => {
  const [mode, setMode] = useState(Mode.EDITING);
  const [board, setBoard] = useState(EMPTY_BOARD);

  const onModeChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setMode(ev.target.value as Mode);
  };

  let nextCell: PuzzleMove | null = null;
  if (mode === Mode.SOLVING) {
    const encoded = encode(board);
    nextCell = ALL_PUZZLE_MOVES[encoded];
    if (nextCell.steps === 0) {
      nextCell = null;
    }
  }

  const onCellChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (
      typeof ev.target.dataset.x === "undefined" ||
      typeof ev.target.dataset.y === "undefined"
    ) {
      return;
    }

    const x = parseInt(ev.target.dataset.x, 0);
    const y = parseInt(ev.target.dataset.y, 0);

    if (
      mode === Mode.SOLVING &&
      (nextCell === null ||
        nextCell.xy === null ||
        nextCell.xy[0] !== x ||
        nextCell.xy[1] !== y)
    ) {
      return;
    }

    setBoard(toggle(board, x, y, mode === Mode.SOLVING));
  };

  const onResetBoard = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setBoard(EMPTY_BOARD);
    setMode(Mode.EDITING);
  };

  let grid = [];
  for (let y = 0; y < 3; ++y) {
    const row = [];
    for (let x = 0; x < 3; ++x) {
      const hint =
        nextCell !== null &&
        nextCell.xy !== null &&
        x === nextCell.xy[0] &&
        y === nextCell.xy[1];

      row.push(
        <input
          key={x}
          type="checkbox"
          checked={board[y][x] == 1}
          data-x={x}
          data-y={y}
          onChange={onCellChange}
          className={
            "m-1 w-[5rem] h-[5rem] ring-4 " +
            (mode === "EDITING" || hint ? "cursor-pointer " : "") +
            (hint ? "ring-green-300" : "ring-transparent")
          }
        />
      );
    }
    grid.push(<div key={y}>{...row}</div>);
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Switch Puzzle Solver</h1>
      <p className="mb-6 max-w-lg">
        Set up the board state in editing mode. Then switch to solving mode and
        click on the highlighted cells to see the path to the solution!
      </p>
      <div className="flex justify-between items-center">
        <div>
          <b className="mr-4">Mode:</b>
          <label htmlFor="mode-editing" className="mr-2">
            Editing
          </label>
          <input
            type="radio"
            id="mode-editing"
            name="mode"
            value="EDITING"
            onChange={onModeChange}
            checked={mode === "EDITING"}
            className="mr-8"
          />
          <label htmlFor="mode-solving" className="mr-2">
            Solving
          </label>
          <input
            type="radio"
            id="mode-solving"
            name="mode"
            value="SOLVING"
            onChange={onModeChange}
            checked={mode === "SOLVING"}
          />
        </div>
        <button
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          type="button"
          onClick={onResetBoard}
        >
          Reset
        </button>
      </div>
      <div className="my-8 flex justify-center">
        <div className="inline-flex flex-col items-center">
          {...grid}
          {mode === "SOLVING" ? (
            <div className="text-xl font-bold mt-4">
              {(nextCell && nextCell.steps) || 0} steps left
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SwitchPage;
