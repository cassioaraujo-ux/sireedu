import React, { useContext } from "react";
import "./styles.css";
import Home from "./Home";
import About from "./About";
import Differences from "./Differences";
import OurOffer from "./OurOffer";
import Intended from "./Intended";
import { Context } from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import PageTitleUpdater from "../../components/PageTitleUpdater";

const LandingPage = () => {
	const { authenticated } = useContext(Context);

	if (authenticated) {
		return <Navigate to="/home" />
	}

	return (
		<div className="landing-page">
			<PageTitleUpdater title={"SIREEDU"} />
			<div className="container">
				<section id="home">
					<Home/>
				</section>
				<section id="about">
					<About />
				</section>
				<section id="differences">
					<Differences />
				</section>
				<section id="intended">
					<Intended />
				</section>
				<section id="our-offer">
					<OurOffer />
				</section>
			</div>
	  	</div>
	);	
}
  
export default LandingPage;