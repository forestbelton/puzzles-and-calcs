import { Operator, Partition } from "./types";

const name = (x: number, y: number) => `X${x}${y}`;

export const generateProlog = (size: number, partitions: Partition[]) => {
  const vars = [];
  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x) {
      vars.push(name(x, y));
    }
  }
  const all_vars = vars.join(",");

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

  const all_partitions: string[] = [];
  for (const { operator, cells, target } of partitions) {
    switch (operator) {
      case null:
        all_partitions.push(
          `    ${name(cells[0].col, cells[0].row)} #= ${target},`
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
        let subs = [
          `${name(cells[0].col, cells[0].row)} + ${target} = ${name(
            cells[1].col,
            cells[1].row
          )}`,
          `${name(cells[1].col, cells[1].row)} + ${target} = ${name(
            cells[0].col,
            cells[0].row
          )}`,
        ];
        all_partitions.push(`  (${subs.join(";")}),`);
        break;
      case Operator.MUL:
        let prod = cells
          .slice(1)
          .reduce(
            (acc, { col, row }) => `${acc} * ${name(col, row)}`,
            name(cells[0].row, cells[0].col)
          );
        all_partitions.push(`  ${prod} #= ${target},`);
        break;
      case Operator.DIV:
        let divs = [
          `${name(cells[0].col, cells[0].row)} * ${target} = ${name(
            cells[1].col,
            cells[1].row
          )}`,
          `${name(cells[1].col, cells[1].row)} * ${target} = ${name(
            cells[0].col,
            cells[0].row
          )}`,
        ];
        all_partitions.push(`  (${divs.join(";")}),`);
        break;
    }
  }

  return `
:- use_module(library(clpfd)).
kenken_puzzle(${all_vars}) :-
  Vars = [${all_vars}],
  Vars ins 1..${size},

${all_rows.join("\n")}

${all_columns.join("\n")}

${all_partitions.join("\n")}

  labeling([ff], Vars).

solve(S) :-
  kenken_puzzle(${all_vars}),
  S = [${all_vars}].
`.trim();
};
