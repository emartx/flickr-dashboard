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

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col,
} from "reactstrap";
// core components
import UserHeader from "../organisms/Headers/UserHeader";
import { useAuth } from "../context/AuthContext.js";
import { StatsSimpleBox } from "../atoms";
import { commaSeparateNumber } from "../util/numbers";
import { useQuery } from "react-query";
import useUserApis from "../infra/users.js";
import { ApiInstance } from "../types/apis.js";

export const Profile: React.FC = () => {
	const { firebaseUser } = useAuth();
	const { getUserInfo } = useUserApis();

	const { data: user, isLoading } = useQuery(ApiInstance.GetUser, () => getUserInfo(firebaseUser.uid));

	if (!user) return <></>;

	return (
		<>
			<UserHeader user={user!} />

			<Container className="mt--7" fluid>
				<Row>
					<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
						<Card className="card-profile shadow">
							<Row className="justify-content-center">
								<Col className="order-lg-2" lg="3">
									<div className="card-profile-image">
										<a href="#pablo" onClick={(e) => e.preventDefault()}>
											<img alt={user?.name} className="rounded-circle" src={user?.photoURL} />
										</a>
									</div>
								</Col>
							</Row>
							<CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
								<div className="d-flex justify-content-between">
									<Button
										className="mr-4"
										color="info"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										size="sm"
									>
										Connect
									</Button>
									<Button
										className="float-right"
										color="default"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										size="sm"
									>
										Message
									</Button>
								</div>
							</CardHeader>
							<CardBody className="pt-0 pt-md-4">
								{ isLoading && <span>Is Loading...</span> }

								{ !isLoading && !!user && (
									<>
										<div className="text-center">
											<h3>
												{user?.name}
											</h3>
											<div className="h5 font-weight-300">
												<i className="ni location_pin mr-2" />
												{user.city}, {user.country}
											</div>
											<div className="h5 mt-4">
												<i className="ni business_briefcase-24 mr-2" />
												{user.occupation}
											</div>
											<div>
												<i className="ni education_hat mr-2" />
											</div>
											<hr className="my-4" />
											<p>
												{user.profile_description}
											</p>
										</div>

										<Row>
											<div className="col">
												<div className="card-profile-stats d-flex justify-content-center mt-md-0">
													<StatsSimpleBox title="Photos" value={commaSeparateNumber(user?.photosCount)} />
													<StatsSimpleBox title="Views" value={commaSeparateNumber(user?.totalViews)} />
												</div>
											</div>
										</Row>

										<Row>
											<div className="col">
												<div className="card-profile-stats d-flex justify-content-center mt-0 md-5">
													<StatsSimpleBox title="Faves" value={commaSeparateNumber(user?.totalFaves)} />
													<StatsSimpleBox title="Comments" value={commaSeparateNumber(user?.totalComments)} />
												</div>
											</div>
										</Row>
									</>
								)}
							</CardBody>
						</Card>
					</Col>
					<Col className="order-xl-1" xl="8">
						<Card className="bg-secondary shadow">
							<CardHeader className="bg-white border-0">
								<Row className="align-items-center">
									<Col xs="8">
										<h3 className="mb-0">My account</h3>
									</Col>
									<Col className="text-right" xs="4">
										<Button
											color="primary"
											href="#pablo"
											onClick={(e) => e.preventDefault()}
											size="sm"
										>
											Settings
										</Button>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								<Form>
									<h6 className="heading-small text-muted mb-4">
										User information
									</h6>
									<div className="pl-lg-4">
										<Row>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-username"
													>
														User ID
													</label>
													<Input
														className="form-control-alternative"
														value={user?.uid}
														id="input-username"
														placeholder="User ID"
														type="text"
                            disabled
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-email"
													>
														Email address
													</label>
													<Input
														className="form-control-alternative"
														id="input-email"
														placeholder="jesse@example.com"
														type="email"
                            value={user?.email}
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-first-name"
													>
														First name
													</label>
													<Input
														className="form-control-alternative"
														value={user.first_name}
														id="input-first-name"
														placeholder="First name"
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label
														className="form-control-label"
														htmlFor="input-last-name"
													>
														Last name
													</label>
													<Input
														className="form-control-alternative"
														value={user.last_name}
														id="input-last-name"
														placeholder="Last name"
														type="text"
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className="my-4" />
									{/* Description */}
									<h6 className="heading-small text-muted mb-4">About me</h6>
									<div className="pl-lg-4">
										<FormGroup>
											<label>About Me</label>
											<Input
												className="form-control-alternative"
												placeholder="A few words about you ..."
												rows="4"
												defaultValue=""
												value={user.profile_description}
												type="textarea"
											/>
										</FormGroup>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};
