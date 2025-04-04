import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	User as FirebaseUser,
} from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/img/icons/common/google.svg";
import { showErrorMessage } from "../util/errorType";
import { useMutation } from "react-query";
import useUserApis from "../infra/users";

export const WelcomePage: React.FC = () => {
	const { setFirebaseUser, setFlickrUser } = useAuth();
	const navigate = useNavigate();

	const { callApiSaveOrUpdateUser } = useUserApis();
	const { mutate: saveOrUpdateUser } = useMutation(
		(user: FirebaseUser) => callApiSaveOrUpdateUser(user), 
		{ onSuccess: (flickrUserName: string) => setFlickrUser(flickrUserName) }
	);

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			console.log("User Info:", result.user);

			saveOrUpdateUser(result.user);
			navigate("/user");
		} catch (error: unknown) {
			showErrorMessage(error);
		}
	};

	// Listen to authentication state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser: FirebaseUser | null) => {
			setFirebaseUser(currentUser || {} as FirebaseUser);
			if(currentUser) {
				navigate('/user');
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<>
			<Col lg="5" md="7">
				<Card className="bg-secondary shadow border-0">
					<CardHeader className="bg-transparent pb-5">
						<div className="text-muted text-center mt-2 mb-3">
							<small>Sign in with</small>
						</div>
						<div className="btn-wrapper text-center">
							<Button
								className="btn-neutral btn-icon"
								color="default"
								href="#pablo"
								onClick={handleGoogleLogin}
							>
								<span className="btn-inner--icon">
									<img alt="..." src={googleLogo} />
								</span>
								<span className="btn-inner--text">Google</span>
							</Button>
						</div>
					</CardHeader>
					<CardBody className="px-lg-5 py-lg-5">
						<div className="text-center text-muted mb-4">
							<small>Or sign in with credentials</small>
						</div>
						<Form role="form" aria-disabled={true}>
							<FormGroup className="mb-3">
								<InputGroup className="input-group-alternative">
									<InputGroupAddon addonType="prepend">
										<InputGroupText>
											<i className="ni ni-email-83" />
										</InputGroupText>
									</InputGroupAddon>
									<Input
										placeholder="Email"
										type="email"
										autoComplete="new-email"
									/>
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className="input-group-alternative">
									<InputGroupAddon addonType="prepend">
										<InputGroupText>
											<i className="ni ni-lock-circle-open" />
										</InputGroupText>
									</InputGroupAddon>
									<Input
										placeholder="Password"
										type="password"
										autoComplete="new-password"
									/>
								</InputGroup>
							</FormGroup>
							<div className="custom-control custom-control-alternative custom-checkbox">
								<input
									className="custom-control-input"
									id=" customCheckLogin"
									type="checkbox"
								/>
								<label
									className="custom-control-label"
									htmlFor=" customCheckLogin"
								>
									<span className="text-muted">Remember me</span>
								</label>
							</div>
							<div className="text-center">
								<Button className="my-4" color="primary" type="button">
									Sign in
								</Button>
							</div>
						</Form>
					</CardBody>
				</Card>
				<Row className="mt-3">
					<Col xs="6">
						<a
							className="text-light"
							href="#pablo"
							onClick={(e) => e.preventDefault()}
						>
							<small>Forgot password?</small>
						</a>
					</Col>
					<Col className="text-right" xs="6">
						<a
							className="text-light"
							href="#pablo"
							onClick={(e) => e.preventDefault()}
						>
							<small>Create new account</small>
						</a>
					</Col>
				</Row>
				<Row></Row>
			</Col>
		</>
	);
};
