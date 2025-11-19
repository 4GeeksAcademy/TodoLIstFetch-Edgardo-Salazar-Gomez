import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { TodoListFetch } from "./TodoListFetch";



//create your first component
const Home = () => {
	return (
		<div className="text-center d-flex flex-column min-vh-100">
			<TodoListFetch />


		</div>
	);
};

export default Home;