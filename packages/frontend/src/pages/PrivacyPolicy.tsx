/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, Link } from "react-router-dom";
// reactstrap components
import { Container, Nav, Navbar, NavItem, NavLink } from "reactstrap";
// core components
import UserFooter from "../organisms/Footers/UserFooter";
import { PrivacyPolicy } from "../organisms";

export const PrivacyPolicyPage = () => {
	const location = useLocation();

	React.useEffect(() => {
		document.documentElement.scrollTop = 0;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		document.scrollingElement && (document.scrollingElement.scrollTop = 0);
	}, [location]);

	return (
		<>
			<div className="main-content">
				<Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
					<Container fluid>
						<Link
							className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
							to="/"
						>
							Flickr Dashboard
						</Link>

						<Nav className="ml-auto d-none d-md-flex" navbar>
							<NavItem>
								<NavLink className="nav-link-icon" to="/auth/login" tag={Link}>
									<i className="ni ni-key-25" />
									<span className="nav-link-inner--text">Login</span>
								</NavLink>
							</NavItem>
						</Nav>
					</Container>
				</Navbar>

				<PrivacyPolicy />

				<Container fluid>
					<UserFooter />
				</Container>
			</div>
		</>
	);
};
