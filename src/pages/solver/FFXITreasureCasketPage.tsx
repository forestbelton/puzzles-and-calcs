import React, { useState } from "react";
import "./FFXITreasureCasketPage.css";

const ALL_CHOICES: number[] = [];
for (let choice = 0; choice < 100; choice++) {
  ALL_CHOICES.push(choice);
}

const ALL_DIGITS: number[] = [];
for (let digit = 0; digit < 10; digit++) {
  ALL_DIGITS.push(digit);
}

const EVEN_DIGITS = new Set(ALL_DIGITS.filter((digit) => digit % 2 == 0));
const ODD_DIGITS = new Set(ALL_DIGITS.filter((digit) => digit % 2 == 1));

type SolverState = {
  oneDigits: Set<number>;
  tenDigits: Set<number>;

  gte: number;
  lte: number;
  oneIs?: number;
};

const newState = (): SolverState => {
  const oneDigits = new Set<number>();
  const tenDigits = new Set<number>();

  for (let digit = 0; digit < 10; digit++) {
    oneDigits.add(digit);
    tenDigits.add(digit);
  }

  return {
    oneDigits,
    tenDigits,
    gte: 0,
    lte: 99,
  };
};

const getChoices = (state: SolverState): Set<number> => {
  const choices = new Set<number>();

  for (let choice = 0; choice < 100; choice++) {
    if (choice < state.gte || choice > state.lte) {
      continue;
    }

    const tensDigit = Math.floor(choice / 10);
    const onesDigit = choice % 10;

    if (
      typeof state.oneIs !== "undefined" &&
      tensDigit != state.oneIs &&
      onesDigit !== state.oneIs
    ) {
      continue;
    }

    if (!state.tenDigits.has(tensDigit) || !state.oneDigits.has(onesDigit)) {
      continue;
    }

    choices.add(choice);
  }

  return choices;
};

type SolverStats = {
  median?: number;
  guesses?: number;
};

const getStats = (choices: Set<number>): SolverStats => {
  let stats: SolverStats = {};

  if (choices.size > 0) {
    const choiceList = [...choices];
    choiceList.sort((a, b) => a - b);
    stats.median = choiceList[Math.floor(choiceList.length / 2)];
  }

  if (choices.size == 1) {
    stats.guesses = 1;
  } else if (choices.size > 1) {
    stats.guesses = Math.ceil(Math.log(choices.size) / Math.log(2));
  }

  return stats;
};

type DigitProps = {
  digits: Set<number>;
  updateDigits: (digits: Set<number>) => void;
};

const Digit = ({ digits, updateDigits }: DigitProps) => {
  const setEvens = () => updateDigits(EVEN_DIGITS);
  const setOdds = () => updateDigits(ODD_DIGITS);
  const clear = () => updateDigits(new Set());

  const toggleDigit = (digit: number) => () => {
    const newDigits = new Set(digits);
    if (newDigits.has(digit)) {
      newDigits.delete(digit);
    } else {
      newDigits.add(digit);
    }
    updateDigits(newDigits);
  };

  return (
    <>
      <div>
        {ALL_DIGITS.map((digit) => (
          <div key={digit} className="FFXITreasureCasketPage-digit">
            <input
              type="checkbox"
              onChange={toggleDigit(digit)}
              checked={digits.has(digit)}
            />
            {digit}
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={setEvens}
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
        >
          Even
        </button>
        &nbsp;
        <button
          onClick={setOdds}
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
        >
          Odd
        </button>
        &nbsp;
        <button
          onClick={clear}
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
        >
          Clear
        </button>
      </div>
    </>
  );
};

const FFXITreasureCasketPage = () => {
  const [state, setState] = useState(newState);

  const choices = getChoices(state);
  const stats = getStats(choices);

  const updateOnes = (oneDigits: Set<number>) => {
    setState({
      ...state,
      oneDigits,
    });
  };

  const updateTens = (tenDigits: Set<number>) => {
    setState({
      ...state,
      tenDigits,
    });
  };

  const onOneIsUpdate = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const oneIs =
      ev.currentTarget.value !== ""
        ? parseInt(ev.currentTarget.value, 10)
        : undefined;
    setState({
      ...state,
      oneIs,
    });
  };

  const onGteUpdate = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let gte = parseInt(ev.currentTarget.value, 10);
    if (gte < 0 || gte > 99) {
      gte = state.gte;
    }

    setState({
      ...state,
      gte,
    });
  };

  const onLteUpdate = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let lte = parseInt(ev.currentTarget.value, 10);
    if (lte < 0 || lte > 99) {
      lte = state.lte;
    }

    setState({
      ...state,
      lte,
    });
  };

  const resetState = () => setState(newState);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">FFXI Treasure Casket</h1>
      <p className="FFXITreasureCasketPage-description">
        Apply treasure casket clues to narrow the possible answer set until you
        can safely guess with the remaining attempts!
      </p>
      <div className="FFXITreasureCasketPage-content">
        <div>
          <div>
            <div>
              <span className="FFXITreasureCasketPage-stats-label">
                Median:
              </span>{" "}
              {stats.median || "N/A"}
            </div>
            <div>
              <span className="FFXITreasureCasketPage-stats-label">
                # Guesses:
              </span>{" "}
              {stats.guesses || "N/A"}
            </div>
          </div>
          <div className="FFXITreasureCasketPage-v-pad" />
          <div>
            <b>Valid choices:</b>
            <div className="FFXITreasureCasketPage-matrix">
              {ALL_CHOICES.map((choice) => (
                <span className="FFXITreasureCasketPage-choice" key={choice}>
                  <input
                    type="checkbox"
                    disabled
                    checked={choices.has(choice)}
                  />
                  {choice}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="FFXITreasureCasketPage-h-pad" />
        <div>
          <div className="FFXITreasureCasketPage-constraints-label">
            Constraints
          </div>
          <div className="FFXITreasureCasketPage-between">
            Between &nbsp;
            <input type="number" value={state.gte} onChange={onGteUpdate} />
            &nbsp; and &nbsp;
            <input type="number" value={state.lte} onChange={onLteUpdate} />
          </div>
          <div className="FFXITreasureCasketPage-one-is">
            One of the digits is &nbsp;
            <input
              type="number"
              value={state.oneIs || ""}
              minLength={0}
              maxLength={1}
              onChange={onOneIsUpdate}
            />
          </div>
          <div className="FFXITreasureCasketPage-label">First digit</div>
          <Digit digits={state.tenDigits} updateDigits={updateTens} />
          <div className="FFXITreasureCasketPage-label">Second digit</div>
          <Digit digits={state.oneDigits} updateDigits={updateOnes} />
          <button
            className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
            onClick={resetState}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FFXITreasureCasketPage;
