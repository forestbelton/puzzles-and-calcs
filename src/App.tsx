import { Link, Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import HomePage from "./pages/HomePage";
import FFXITreasureCasketPage from "./pages/solver/FFXITreasureCasketPage";
import SwitchPage from "./pages/solver/SwitchPage";
import NotFoundPage from "./pages/NotFoundPage";
import ClassicZeldaLootPage from "./pages/calculator/ClassicZeldaLootPage";
import KenKenPage from "./pages/solver/KenKenPage";

const App = () => {
  return (
    <Router hook={useHashLocation}>
      <div className="flex">
        <nav className="pl-4">
          <h2 className="text-2xl font-bold my-4">
            <Link href="/">
              Puzzle Solvers
              <br />
              &amp; Calculators
            </Link>
          </h2>
          <h3 className="font-bold">Solvers</h3>
          <ul className="mb-4">
            <li>
              <Link href="/switch">Switch</Link>
            </li>
            <li>
              <Link href="/ffxi-treasure-casket">FFXI Treasure Casket</Link>
            </li>
            <li>
              <Link href="/kenken">KenKen</Link>
            </li>
          </ul>
          <h3 className="font-bold">Calculators</h3>
          <ul>
            <li>
              <Link href="/classic-zelda-loot">Classic Zelda Loot</Link>
            </li>
          </ul>
        </nav>
        <div className="bg-white mx-6" style={{ width: 2, height: "100vh" }} />
        <Switch>
          <Route path="/switch" component={SwitchPage} />
          <Route
            path="/ffxi-treasure-casket"
            component={FFXITreasureCasketPage}
          />
          <Route path="/kenken" component={KenKenPage} />
          <Route path="/classic-zelda-loot" component={ClassicZeldaLootPage} />
          <Route path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
