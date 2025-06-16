import { Divide, Minus, Plus, X } from "lucide-react";
import { Operator } from "./types";

export const ALL_OPERATORS = [
  { op: Operator.ADD, icon: Plus },
  { op: Operator.SUB, icon: Minus },
  { op: Operator.MUL, icon: X },
  { op: Operator.DIV, icon: Divide },
];

export const OPERATOR_SYMBOLS: Record<Operator, string> = {
  [Operator.ADD]: "+",
  [Operator.SUB]: "−",
  [Operator.MUL]: "×",
  [Operator.DIV]: "÷",
};

type Props = {
  disabled: boolean;
  currentOperation: Operator;
  onNewOperation: (op: Operator) => void;
  op: Operator;
  Icon: typeof Plus;
};

export const OperatorButton = ({
  currentOperation,
  disabled,
  Icon,
  onNewOperation,
  op,
}: Props) => (
  <button
    onClick={() => onNewOperation(op)}
    disabled={disabled}
    className={`px-3 py-2 rounded ${
      disabled
        ? "bg-gray-400 text-gray-500 cursor-not-allowed"
        : currentOperation === op
        ? "bg-blue-600"
        : "bg-gray-300 text-black hover:text-white hover:bg-blue-400"
    }`}
  >
    <Icon size={16} />
  </button>
);
