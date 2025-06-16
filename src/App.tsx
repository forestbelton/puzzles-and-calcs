import { Link, Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import "./App.css";
import HomePage from "./pages/HomePage";
import FFXITreasureCasketPage from "./pages/solver/FFXITreasureCasketPage";
import SwitchPage from "./pages/solver/SwitchPage";
import NotFoundPage from "./pages/NotFoundPage";
import ClassicZeldaLootPage from "./pages/calculator/ClassicZeldaLootPage";
import KenKenPage from "./pages/solver/KenKenPage";

const App = () => {
  return (
    <Router hook={useHashLocation}>
      <div className="App">
        <nav className="App-nav">
          <h2>
            <Link href="/">
              Puzzle Solvers
              <br />
              &amp; Calculators
            </Link>
          </h2>
          <h3>Solvers</h3>
          <ul className="App-navlist">
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
          <h3>Calculators</h3>
          <ul className="App-navlist">
            <li>
              <Link href="/classic-zelda-loot">Classic Zelda Loot</Link>
            </li>
          </ul>
        </nav>
        <div className="App-divider"></div>
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
