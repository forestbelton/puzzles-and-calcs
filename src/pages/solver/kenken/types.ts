export enum Operator {
  ADD = "ADD",
  SUB = "SUB",
  MUL = "MUL",
  DIV = "DIV",
}

export type Cell = {
  row: number;
  col: number;
};

export const cellEquals = (a: Cell, b: Cell) =>
  a.col === b.col && a.row === b.row;

export type Partition = {
  id: number;
  cells: Cell[];
  target: number;
  operator: Operator | null;
};

export const partitionForCell = (partitions: Partition[], target: Cell) =>
  partitions.find((partition) =>
    partition.cells.some((cell: Cell) => cellEquals(target, cell))
  );

export const deletePartition = (partitions: Partition[], partitionId: number) =>
  partitions.filter((partition) => partition.id !== partitionId);

// Check if selected cells form a connected region
export const areaCellsConnected = (cells: Cell[]) => {
  if (cells.length <= 1) {
    return true;
  }

  // Use BFS to check if all cells are reachable from the first cell
  const visited = new Set();
  const queue = [cells[0]];
  visited.add(`${cells[0].row},${cells[0].col}`);

  const cellSet = new Set(cells.map((cell) => `${cell.row},${cell.col}`));

  while (queue.length > 0) {
    const current = queue.shift();
    if (typeof current === "undefined") {
      break;
    }

    // Check all 4 adjacent cells
    const adjacent = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 },
    ];

    for (const adj of adjacent) {
      const adjKey = `${adj.row},${adj.col}`;
      if (cellSet.has(adjKey) && !visited.has(adjKey)) {
        visited.add(adjKey);
        queue.push(adj);
      }
    }
  }

  return visited.size === cells.length;
};

export const partitionCoversBoard = (size: number, partitions: Partition[]) => {
  const emptyCells = new Set<string>();
  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x) {
      emptyCells.add(`${x},${y}`);
    }
  }
  partitions.forEach((partition) =>
    partition.cells.forEach((cell) =>
      emptyCells.delete(`${cell.col},${cell.row}`)
    )
  );
  return emptyCells.size == 0;
};
