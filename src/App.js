import "./App.css";
import { Login } from "./login";
import Mapping from "./map";
import { TestMap } from "./testMap";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        {/* <TestMap />
        <Login /> */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>

        <Route path="/test" component={TestMap} />
        <Route path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default App;
