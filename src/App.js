import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Garcom from "./pages/Garcom";
import Checkout from "./pages/Checkout";
import Cozinha from "./pages/Cozinha";
import Home from "./pages/Home";
import Footer from "./components/Footer";

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/checkout/:customer_id">
					<Checkout />
					<Footer />
				</Route>
				<Route exact path="/garcom">
					<Garcom />
					<Footer />
				</Route>
				<Route exact path="/cozinha">
					<Cozinha />
					<Footer />
				</Route>
				<Route exact path="/">
					<Home />
					<Footer />
				</Route>
				<Route path="*">
					<h1>404 - Página não encontrada</h1>
					<Footer />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
