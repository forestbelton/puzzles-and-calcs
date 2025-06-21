import { Operator, Partition } from "./types";

const name = (x: number, y: number) => `X${x}${y}`;

let loaded = false;

let Module: any;
let Prolog: any;

const init = async () => {
  if (loaded) {
    return;
  }

  loaded = true;

  // @ts-ignore
  Module = await window.SWIPL({
    on_output: () => {},
  });
  Prolog = Module.prolog;
};

const OPERATOR_SORT_VALUES: Record<Operator | "", number> = {
  [""]: -1,
  [Operator.ADD]: 0,
  [Operator.MUL]: 1,
  [Operator.SUB]: 2,
  [Operator.DIV]: 3,
};

const generateProlog = (size: number, partitions: Partition[]) => {
  const board = [];
  const rows = [];
  for (let y = 0; y < size; ++y) {
    board.push(`Row${y}`);
    const row = [];
    for (let x = 0; x < size; ++x) {
      row.push(name(x, y));
    }
    rows.push(`  Row${y} = [${row.join(", ")}],`);
  }

  const all_rows = [];
  for (let y = 0; y < size; ++y) {
    const row = [];
    for (let x = 0; x < size; ++x) {
      row.push(name(x, y));
    }
    all_rows.push(`  all_distinct([${row.join(",")}]),`);
  }

  const all_columns: string[] = [];
  for (let x = 0; x < size; ++x) {
    const row = [];
    for (let y = 0; y < size; ++y) {
      row.push(name(x, y));
    }
    all_columns.push(`  all_distinct([${row.join(",")}]),`);
  }

  // Place strongest constraints first
  partitions.sort((p, q) => {
    const cellDifference = p.cells.length - q.cells.length;
    if (cellDifference !== 0) {
      return cellDifference;
    }

    const operatorDifference =
      OPERATOR_SORT_VALUES[p.operator || ""] -
      OPERATOR_SORT_VALUES[q.operator || ""];
    if (operatorDifference !== 0) {
      return operatorDifference;
    }

    return p.target - q.target;
  });

  const all_partitions: string[] = [];
  for (const { operator, cells, target } of partitions) {
    switch (operator) {
      case null:
        all_partitions.push(
          `  ${name(cells[0].col, cells[0].row)} #= ${target},`
        );
        break;
      case Operator.ADD:
        let sum = cells
          .slice(1)
          .reduce(
            (acc, { col, row }) => `${acc} + ${name(col, row)}`,
            name(cells[0].col, cells[0].row)
          );
        all_partitions.push(`  ${sum} #= ${target},`);
        break;
      case Operator.SUB:
        all_partitions.push(
          `  abs(${cells
            .map(({ col, row }) => name(col, row))
            .join("-")}) #= ${target},`
        );
        break;
      case Operator.MUL:
        let prod = cells
          .slice(1)
          .reduce(
            (acc, { col, row }) => `${acc} * ${name(col, row)}`,
            name(cells[0].col, cells[0].row)
          );
        all_partitions.push(`  ${prod} #= ${target},`);
        break;
      case Operator.DIV:
        all_partitions.push(
          `  divide(${cells
            .map(({ col, row }) => name(col, row))
            .join(",")},${target}),`
        );
        break;
    }
  }

  return `
:- use_module(library(clpfd)).

divide(X, Y, Target) :-
  Larger #= max(X, Y),
  Smaller #= min(X, Y),
  Larger #= Smaller * Target.

solve(Board) :-
  Board = [${board.join(", ")}],
${rows.join("\n")}

  append(Board, Vars),
  Vars ins 1..${size},

${all_rows.join("\n")}

${all_columns.join("\n")}

${all_partitions.join("\n")}

  labeling([ff], Vars).
`.trim();
};

export const solve = async (size: number, partitions: Partition[]) => {
  const prologSource = generateProlog(size, partitions);
  console.log(prologSource);

  await init();
  await Prolog.unregister_atom("divide");
  await Prolog.unregister_atom("solve");
  await Prolog.load_string(prologSource);

  console.log("Beginning solve...");
  const start = +new Date();
  const [result] = await Prolog.forEach("solve(S)");
  const elapsed = (+new Date() - start) / 1000;
  console.log(`Solve done. Took ${elapsed} seconds.`);

  const board: number[][] = [];

  for (let y = 0; y < size; ++y) {
    const row: number[] = [];
    for (let x = 0; x < size; ++x) {
      row.push(result.S[y][x]);
    }
    board.push(row);
  }

  console.log(board);
  return board;
};
