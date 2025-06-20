import { useState, useRef, useEffect } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import {
  ALL_OPERATORS,
  OPERATOR_SYMBOLS,
  OperatorButton,
} from "./kenken/Operator";
import {
  areaCellsConnected,
  Cell,
  cellEquals,
  deletePartition,
  Operator,
  Partition,
  partitionCoversBoard,
  partitionForCell,
} from "./kenken/types";
import { generateProlog } from "./kenken/solve";

type EditorState = {
  nextId?: number;
  size: number;
  partitions: Partition[];
};

export const emptyState = (): EditorState => ({
  size: 4,
  partitions: [],
});

type Props = {
  state: EditorState;
  onChange?: (state: EditorState) => void;
};

const PARTITION_COLORS = [
  "bg-red-200 border-red-400",
  "bg-blue-200 border-blue-400",
  "bg-green-200 border-green-400",
  "bg-yellow-200 border-yellow-400",
  "bg-purple-200 border-purple-400",
  "bg-pink-200 border-pink-400",
  "bg-indigo-200 border-indigo-400",
  "bg-orange-200 border-orange-400",
  "bg-teal-200 border-teal-400",
  "bg-gray-200 border-gray-400",
];

// Get partition color based on stable ID
const getPartitionColor = (partition: Partition) =>
  PARTITION_COLORS[partition.id % PARTITION_COLORS.length];

const KenKenEditor = ({ state, onChange }: Props) => {
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<Cell | null>(null);
  const [currentOperation, setCurrentOperation] = useState(Operator.ADD);
  const [currentTarget, setCurrentTarget] = useState("");
  const boardRef = useRef(null);

  const handleChange = onChange || (() => {});

  // Handle cell mouse down
  const handleCellMouseDown = (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    // Don't allow selecting cells that are already in a partition
    if (partitionForCell(state.partitions, { row, col })) {
      return;
    }

    // Check if cell is already selected
    const cellIndex = selectedCells.findIndex(
      (cell) => cell.row === row && cell.col === col
    );

    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click: toggle individual cell
      if (cellIndex >= 0) {
        // Remove cell from selection
        setSelectedCells(
          selectedCells.filter((_, index) => index !== cellIndex)
        );
      } else {
        // Add cell to selection
        setSelectedCells([...selectedCells, { row, col }]);
      }
    } else {
      // Regular click: start new selection or toggle if already selected
      if (cellIndex >= 0 && selectedCells.length === 1) {
        // Deselect if it's the only selected cell
        setSelectedCells([]);
      } else {
        // Start new selection
        setSelectedCells([{ row, col }]);
        setIsSelecting(true);
        setDragStart({ row, col });
      }
    }
  };

  // Handle cell mouse enter during drag
  const handleCellMouseEnter = (row: number, col: number) => {
    if (
      isSelecting &&
      dragStart &&
      !selectedCells.some((cell) => cell.row === row && cell.col === col)
    ) {
      const target = { row, col };
      // Don't allow selecting cells that are already in a partition
      if (!partitionForCell(state.partitions, target)) {
        setSelectedCells((prev) => [...prev, target]);
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsSelecting(false);
    setDragStart(null);
  };

  // Add event listener for mouse up
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Reset current partition selection
  const resetSelection = () => {
    setSelectedCells([]);
    setCurrentTarget("");
    setIsSelecting(false);
    setDragStart(null);
  };

  // Create partition from selected cells
  const createPartition = () => {
    if (selectedCells.length === 0 || !currentTarget) {
      return;
    }

    const targetValue = parseInt(currentTarget);
    if (isNaN(targetValue) || targetValue <= 0) {
      return;
    }

    // Check if cells are connected
    if (!areaCellsConnected(selectedCells)) {
      return;
    }

    const newPartition = {
      id: state.nextId || 0,
      cells: [...selectedCells],
      operator: selectedCells.length === 1 ? null : currentOperation,
      target: targetValue,
    };

    // Remove any existing partitions that overlap with selected cells
    const filteredPartitions = state.partitions.filter(
      (partition) =>
        !partition.cells.some((partitionCell) =>
          selectedCells.some((selectedCell) =>
            cellEquals(selectedCell, partitionCell)
          )
        )
    );

    handleChange({
      ...state,
      partitions: [...filteredPartitions, newPartition],
      nextId: (state.nextId || 0) + 1,
    });
    setSelectedCells([]);
    setCurrentTarget("");
  };

  // Change board size
  const changeBoardSize = (newSize: number) => {
    // Ensure size is an integer >= 2
    const size = Math.max(2, Math.floor(newSize));

    // Clear selection if any selected cells are outside the new board
    if (selectedCells.some((cell) => cell.row >= size || cell.col >= size)) {
      setSelectedCells([]);
    }

    handleChange({
      ...state,
      size,
      partitions: state.partitions.filter((partition) =>
        partition.cells.every((cell) => cell.row < size && cell.col < size)
      ),
    });
  };

  // Clear all partitions
  const clearBoard = () =>
    handleChange({
      ...state,
      partitions: [],
    });

  const solveBoard = () => {
    const plg = generateProlog(state.size, state.partitions);
    console.log(plg);
  };

  // Check if cell is selected
  const isCellSelected = (target: Cell) =>
    selectedCells.some((cell) => cellEquals(cell, target));

  return (
    <div className="py-7 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">KenKen Puzzle Editor</h2>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Board Size */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <label className="font-medium w-32">Board Size:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.size}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 2) {
                    changeBoardSize(value);
                  }
                }}
                className="border rounded px-3 py-1 w-20"
                min="2"
                max="9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {/* Solve Board */}
            <button
              onClick={solveBoard}
              disabled={!partitionCoversBoard(state.size, state.partitions)}
              className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
            >
              Solve Board
            </button>

            {/* Clear Board */}
            <button
              onClick={clearBoard}
              className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Clear Board
            </button>
          </div>
        </div>

        {/* Partition Creation */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="font-medium w-32">Create Partition:</label>
          <div className="flex gap-2">
            {ALL_OPERATORS.map(({ op, icon }) => (
              <OperatorButton
                key={op}
                op={op}
                currentOperation={currentOperation}
                disabled={selectedCells.length === 1}
                onNewOperation={setCurrentOperation}
                Icon={icon}
              />
            ))}
          </div>
          <input
            type="number"
            placeholder="Target"
            value={currentTarget}
            onChange={(e) => setCurrentTarget(e.target.value)}
            className="border rounded px-3 py-2 w-20"
            style={{ minWidth: "6rem" }}
            min="1"
          />
          <button
            onClick={createPartition}
            disabled={selectedCells.length === 0 || !currentTarget}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-500"
            style={{ minWidth: "12rem" }}
          >
            Add Partition ({selectedCells.length} cells)
          </button>
          <button
            onClick={resetSelection}
            disabled={selectedCells.length === 0 && !currentTarget}
            className="px-4 py-2 bg-gray-400 text-white rounded disabled:bg-gray-500"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex gap-6 justify-between">
        <div className="flex flex-1 justify-center items-center">
          <div
            ref={boardRef}
            className="inline-block border-2 border-black"
            style={{ userSelect: "none" }}
          >
            {Array.from({ length: state.size }, (_, row) => (
              <div key={row} className="flex">
                {Array.from({ length: state.size }, (_, col) => {
                  const target = { row, col };
                  const partition = partitionForCell(state.partitions, target);
                  const isSelected = isCellSelected(target);
                  const isTopLeft =
                    partition && cellEquals(partition.cells[0], target);

                  return (
                    <div
                      key={col}
                      className={`
                        w-12 h-12 border border-gray-400 relative
                        ${partition ? getPartitionColor(partition) : "bg-white"}
                        ${
                          isSelected
                            ? "bg-blue-200 ring-2 ring-blue-500 ring-inset"
                            : ""
                        }
                        ${
                          partition
                            ? "cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-50"
                        }
                      `}
                      onMouseDown={(e) => handleCellMouseDown(row, col, e)}
                      onMouseEnter={() => handleCellMouseEnter(row, col)}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-300 bg-opacity-50 border-2 border-blue-600 pointer-events-none"></div>
                      )}
                      {isTopLeft && (
                        <div className="absolute top-0 left-0 text-xs font-bold p-1 leading-none z-10 text-gray-600">
                          {partition.target}
                          {partition.operator !== null
                            ? OPERATOR_SYMBOLS[partition.operator]
                            : ""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Partition List */}
        <div className="w-64">
          <h3 className="font-bold mb-3">
            Partitions ({state.partitions.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {state.partitions.map((partition) => (
              <div
                key={partition.id}
                className={`p-3 rounded border-2 ${getPartitionColor(
                  partition
                )}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-black">
                    {partition.target}
                    {partition.operator !== null
                      ? OPERATOR_SYMBOLS[partition.operator]
                      : ""}
                  </div>
                  <button
                    onClick={() =>
                      handleChange({
                        ...state,
                        partitions: deletePartition(
                          state.partitions,
                          partition.id
                        ),
                      })
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Cells:{" "}
                  {partition.cells
                    .map((cell) => `(${cell.row + 1},${cell.col + 1})`)
                    .join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 border-2 border-gray-300 rounded">
        <h4 className="font-bold mb-2">How to use:</h4>
        <ul className="text-sm space-y-1">
          <li>
            • <strong>Click</strong> a cell to start selecting
          </li>
          <li>
            • <strong>Drag</strong> to add adjacent cells to the selection
          </li>
          <li>
            • <strong>Ctrl/Cmd+Click</strong> to add/remove individual cells
          </li>
        </ul>
      </div>
    </div>
  );
};

const KenKenPage = () => {
  const [state, setState] = useState(emptyState());
  return <KenKenEditor state={state} onChange={setState} />;
};

export default KenKenPage;
