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
import { Link } from "react-router-dom";
import {
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Form,
	FormGroup,
	InputGroupAddon,
	InputGroupText,
	Input,
	InputGroup,
	Navbar,
	Nav,
	Container,
	Media,
} from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "../../firebase";
import { showErrorMessage } from "../../util/errorType";

type UserNavbarProps = {
	brandText: string;
}
const UserNavbar: React.FC<UserNavbarProps> = ({ brandText }) => {
	const { firebaseUser, setFirebaseUser, setFlickrUser } = useAuth();

	const handleGoogleLogout = () => {
		signOut(auth)
			.then(() => {
				console.log("User logged out successfully.");
				setFlickrUser(undefined);
				setFirebaseUser({} as FirebaseUser);
			})
			.catch((error: unknown) => {
				showErrorMessage(error);
			});
	};

	return (
		<>
			<Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
				<Container fluid>
					<Link
						className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
						to="/"
					>
						{brandText}
					</Link>
					<Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
						<FormGroup className="mb-0">
							<InputGroup className="input-group-alternative">
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<i className="fas fa-search" />
									</InputGroupText>
								</InputGroupAddon>
								<Input placeholder="Search" type="text" />
							</InputGroup>
						</FormGroup>
					</Form>
					<Nav className="align-items-center d-none d-md-flex" navbar>
						<UncontrolledDropdown nav>
							<DropdownToggle className="pr-0" nav>
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img
											alt={firebaseUser.displayName || "User's Name"}
											src={firebaseUser.photoURL || ""}
										/>
									</span>
									<Media className="ml-2 d-none d-lg-block">
										<span className="mb-0 text-sm font-weight-bold">
											{firebaseUser.displayName}
										</span>
									</Media>
								</Media>
							</DropdownToggle>
							<DropdownMenu className="dropdown-menu-arrow" right>
								<DropdownItem className="noti-title" header tag="div">
									<h6 className="text-overflow m-0">Welcome!</h6>
								</DropdownItem>
								<DropdownItem to="/user/user-profile" tag={Link}>
									<i className="ni ni-single-02" />
									<span>My profile</span>
								</DropdownItem>
								<DropdownItem to="/user/settings" tag={Link}>
									<i className="ni ni-settings-gear-65" />
									<span>Settings</span>
								</DropdownItem>
								<DropdownItem to="/user/user-profile" tag={Link} disabled>
									<i className="ni ni-calendar-grid-58" />
									<span>Activity</span>
								</DropdownItem>
								<DropdownItem to="/user/user-profile" tag={Link} disabled>
									<i className="ni ni-support-16" />
									<span>Support</span>
								</DropdownItem>
								<DropdownItem divider />
								<DropdownItem href="#pablo" onClick={handleGoogleLogout}>
									<i className="ni ni-user-run" />
									<span>Logout</span>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default UserNavbar;
