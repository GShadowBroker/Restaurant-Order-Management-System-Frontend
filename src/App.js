import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Garcom from "./pages/Garcom";
import Cozinha from "./pages/Cozinha";
import Retiradas from "./pages/Retiradas";
import Home from "./pages/Home";

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/garçom">
					<Garcom />
				</Route>
				<Route exact path="/cozinha">
					<Cozinha />
				</Route>
				<Route exact path="/retiradas">
					<Retiradas />
				</Route>
				<Route exact path="/">
					<Home />
				</Route>
				<Route path="*">
					<h1>404 - Página não encontrada</h1>
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
