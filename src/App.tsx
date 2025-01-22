import { Link, Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import SwitchPage from "./pages/SwitchPage";
import "./App.css";
import HomePage from "./pages/HomePage";
import FFXITreasureCasketPage from "./pages/FFXITreasureCasketPage";

const App = () => {
  return (
    <Router hook={useHashLocation}>
      <div className="App">
        <nav className="App-nav">
          <h2>
            <Link href="/">Puzzles</Link>
          </h2>
          <ul className="App-navlist">
            <li>
              <Link href="/switch">Switch</Link>
            </li>
            <li>
              <Link href="/ffxi-treasure-casket">FFXI Treasure Casket</Link>
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
          <Route component={HomePage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
