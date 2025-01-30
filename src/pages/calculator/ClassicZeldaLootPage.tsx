import { useState } from "react";
import "./ClassicZeldaLootPage.css";

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

const ITEM_CLASSNAMES: Record<LootItem, string> = {
  [LootItem.HEART]: "ClassicZeldaLootPage-ItemHeart",
  [LootItem.BOMB]: "ClassicZeldaLootPage-ItemBomb",
  [LootItem.RUPEE1]: "ClassicZeldaLootPage-ItemRupee1",
  [LootItem.RUPEE5]: "ClassicZeldaLootPage-ItemRupee5",
  [LootItem.FAIRY]: "ClassicZeldaLootPage-ItemFairy",
  [LootItem.MAGICAL_CLOCK]: "ClassicZeldaLootPage-ItemMagicalClock",
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
    <div>
      <h1>Classic Zelda Loot</h1>
      <p className="ClassicZeldaLootPage-description">
        In the Legend of Zelda, which item is dropped by an enemy is
        deterministic. This is calculated based on two counters: the{" "}
        <b>kill counter</b> (0-9) and the <b>forced item drop counter</b>{" "}
        (0-10).
      </p>
      <p className="ClassicZeldaLootPage-description">
        Both counters increment on a kill, but the forced item drop counter will
        reset if Link takes damage. If an item drop occurs and the forced item
        drop counter is 10, the forced item drops instead of the one that would
        regularly drop.
      </p>
      <div className="ClassicZeldaLootPage-Field">
        <label className="ClassicZeldaLootPage-Label">Kill Counter</label>
        &nbsp; {kills}
      </div>
      <div className="ClassicZeldaLootPage-Field">
        <label className="ClassicZeldaLootPage-Label">
          Forced Item Counter
        </label>
        &nbsp; {force}
      </div>
      <div>
        <button
          type="button"
          className="ClassicZeldaLootPage-Button"
          onClick={onIncrement}
        >
          Increment
        </button>
        <button
          type="button"
          className="ClassicZeldaLootPage-Button"
          onClick={onReset}
        >
          Reset Forced
        </button>
        <button
          type="button"
          className="ClassicZeldaLootPage-Button"
          onClick={onFullReset}
        >
          Full Reset
        </button>
      </div>
      <div>
        <table className="ClassicZeldaLootPage-DropTable">
          <thead>
            <tr>
              <th>
                <b>A</b>
              </th>
              <th>
                <b>B</b>
              </th>
              <th>
                <b>C</b>
              </th>
              <th>
                <b>D</b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {[
                Object.values(CATEGORY_DROPS).map((table, i) => (
                  <td key={i}>
                    <div className={ITEM_CLASSNAMES[table[kills]]} />
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
