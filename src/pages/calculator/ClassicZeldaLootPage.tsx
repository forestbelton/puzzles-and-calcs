import { useState } from "react";

enum LootItem {
  HEART,
  BOMB,
  RUPEE1,
  RUPEE5,
  FAIRY,
  MAGICAL_CLOCK,
}

enum EnemyCategory {
  A,
  B,
  C,
  D,
}

const BASE_ITEM_STYLE: React.CSSProperties = {
  backgroundImage: "url(/puzzles-and-calcs/zelda-item-spritesheet.png)",
  backgroundPositionY: 0,
  backgroundSize: "cover",
  imageRendering: "pixelated",
  width: 64,
  height: 64,
  margin: "0 1rem",
};

const ITEM_OFFSETS: Record<LootItem, number> = {
  [LootItem.HEART]: 0,
  [LootItem.BOMB]: -64,
  [LootItem.RUPEE1]: -128,
  [LootItem.RUPEE5]: -192,
  [LootItem.FAIRY]: -256,
  [LootItem.MAGICAL_CLOCK]: -320,
};

const CATEGORY_DROPS: Record<EnemyCategory, LootItem[]> = {
  [EnemyCategory.A]: [
    LootItem.RUPEE1,
    LootItem.HEART,
    LootItem.RUPEE1,
    LootItem.FAIRY,
    LootItem.RUPEE1,
    LootItem.HEART,
    LootItem.HEART,
    LootItem.RUPEE1,
    LootItem.RUPEE1,
    LootItem.HEART,
  ],
  [EnemyCategory.B]: [
    LootItem.BOMB,
    LootItem.RUPEE1,
    LootItem.MAGICAL_CLOCK,
    LootItem.RUPEE1,
    LootItem.HEART,
    LootItem.BOMB,
    LootItem.RUPEE1,
    LootItem.BOMB,
    LootItem.HEART,
    LootItem.HEART,
  ],
  [EnemyCategory.C]: [
    LootItem.RUPEE1,
    LootItem.HEART,
    LootItem.RUPEE1,
    LootItem.RUPEE5,
    LootItem.HEART,
    LootItem.MAGICAL_CLOCK,
    LootItem.RUPEE1,
    LootItem.RUPEE1,
    LootItem.RUPEE1,
    LootItem.RUPEE5,
  ],
  [EnemyCategory.D]: [
    LootItem.HEART,
    LootItem.FAIRY,
    LootItem.RUPEE1,
    LootItem.HEART,
    LootItem.FAIRY,
    LootItem.HEART,
    LootItem.HEART,
    LootItem.HEART,
    LootItem.RUPEE1,
    LootItem.HEART,
  ],
};

const ClassicZeldaLootPage = () => {
  const [kills, setKills] = useState(0);
  const [force, setForce] = useState(0);

  const onIncrement = () => {
    setKills((kills + 1) % 10);
    setForce(Math.min(force + 1, 10));
  };

  const onReset = () => {
    setForce(0);
  };

  const onFullReset = () => {
    setKills(0);
    setForce(0);
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Classic Zelda Loot</h1>
      <p className="max-w-xl my-4">
        In the Legend of Zelda, which item is dropped by an enemy is
        deterministic. This is calculated based on two counters: the{" "}
        <b>kill counter</b> (0-9) and the <b>forced item drop counter</b>{" "}
        (0-10).
      </p>
      <p className="max-w-xl my-4 mb-8">
        Both counters increment on a kill, but the forced item drop counter will
        reset if Link takes damage. If an item drop occurs and the forced item
        drop counter is 10, the forced item drops instead of the one that would
        regularly drop.
      </p>
      <div>
        <label className="inline-block font-bold" style={{ minWidth: "11rem" }}>
          Kill Counter
        </label>
        &nbsp; {kills}
      </div>
      <div>
        <label className="inline-block font-bold" style={{ minWidth: "11rem" }}>
          Forced Item Counter
        </label>
        &nbsp; {force}
      </div>
      <div className="mt-8 mb-4 flex justify-center">
        <button
          type="button"
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          onClick={onIncrement}
        >
          Increment
        </button>
        <button
          type="button"
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          onClick={onReset}
        >
          Reset Forced
        </button>
        <button
          type="button"
          className="m-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          onClick={onFullReset}
        >
          Full Reset
        </button>
      </div>
      <div className="flex justify-center">
        <table>
          <thead>
            <tr>
              <th className="pb-4">
                <b>A</b>
              </th>
              <th className="pb-4">
                <b>B</b>
              </th>
              <th className="pb-4">
                <b>C</b>
              </th>
              <th className="pb-4">
                <b>D</b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {[
                Object.values(CATEGORY_DROPS).map((table, i) => (
                  <td key={i}>
                    <div
                      style={{
                        ...BASE_ITEM_STYLE,
                        backgroundPositionX: ITEM_OFFSETS[table[kills]],
                      }}
                    />
                  </td>
                )),
              ]}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassicZeldaLootPage;
