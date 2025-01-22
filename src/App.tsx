import { Link, Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import SwitchPage from "./pages/SwitchPage";
import "./App.css";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router hook={useHashLocation}>
      <div className="App">
        <nav className="App-nav">
          <h2>
            <Link href="/">Puzzles</Link>
          </h2>
          <Link href="/switch">Switch</Link>
        </nav>
        <div className="App-divider"></div>
        <Switch>
          <Route path="/switch" component={SwitchPage} />
          <Route component={HomePage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
