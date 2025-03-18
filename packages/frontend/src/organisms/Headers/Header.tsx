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

import { ReactElement, useState } from "react";
import { useQuery } from "react-query";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { commaSeparateNumber } from "../../util/numbers";
import { getUserInfo } from "../../infra/users";
import { User } from "@flickr-dashboard/core/src/types"
import { ApiInstance } from "../../types/apis";

type Props = {
  displayStats?: boolean;
	actions?: ReactElement;
};

const Header: React.FC<Props> = ({ displayStats = false, actions = <></> }) => {
	const { firebaseUser } = useAuth();
	
	const [photosCount, setPhotosCount] = useState(0);
	const [userViews, setUserViews] = useState(0);
	const [userFaves, setUserFaves] = useState(0);
	const [userComments, setUserComments] = useState(0);

	const { isLoading } = useQuery(ApiInstance.GetUser, () => getUserInfo(firebaseUser.uid), { onSuccess: (userInfo: User) => {
		if (userInfo) {
			setPhotosCount(userInfo.photosCount);
			setUserViews(userInfo.totalViews);
			setUserFaves(userInfo.totalFaves);
			setUserComments(userInfo.totalComments);
		}
	}});

	return (
		<>
			<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
				<Container fluid>
					<div className="header-body">
						{displayStats && (
							<Row>
								<Col lg="6" xl="3">
									<Card className="card-stats mb-4 mb-xl-0">
										<CardBody>
											<Row>
												<div className="col">
													<CardTitle
														tag="h5"
														className="text-uppercase text-muted mb-0"
													>
														Photos
													</CardTitle>
													<span className="h2 font-weight-bold mb-0">
														{ isLoading && "?" }
														{ !isLoading && commaSeparateNumber(photosCount) }
													</span>
												</div>
												<Col className="col-auto">
													<div className="icon icon-shape bg-danger text-white rounded-circle shadow">
														<i className="fas fa-image" />
													</div>
												</Col>
											</Row>
											<p className="mt-3 mb-0 text-muted text-sm">
												<span className="text-success mr-2">
													<i className="fa fa-arrow-up" /> 1.00%
												</span>{" "}
												<span className="text-nowrap">Since last month</span>
											</p>
										</CardBody>
									</Card>
								</Col>
								<Col lg="6" xl="3">
									<Card className="card-stats mb-4 mb-xl-0">
										<CardBody>
											<Row>
												<div className="col">
													<CardTitle
														tag="h5"
														className="text-uppercase text-muted mb-0"
													>
														Views
													</CardTitle>
													<span className="h2 font-weight-bold mb-0">
														{ isLoading && "?" }
														{ !isLoading && commaSeparateNumber(userViews) }
													</span>
												</div>
												<Col className="col-auto">
													<div className="icon icon-shape bg-warning text-white rounded-circle shadow">
														<i className="fas fa-eye" />
													</div>
												</Col>
											</Row>
											<p className="mt-3 mb-0 text-muted text-sm">
												<span className="text-danger mr-2">
													<i className="fas fa-arrow-down" /> 1.00%
												</span>{" "}
												<span className="text-nowrap">Since last week</span>
											</p>
										</CardBody>
									</Card>
								</Col>
								<Col lg="6" xl="3">
									<Card className="card-stats mb-4 mb-xl-0">
										<CardBody>
											<Row>
												<div className="col">
													<CardTitle
														tag="h5"
														className="text-uppercase text-muted mb-0"
													>
														Faves
													</CardTitle>
													<span className="h2 font-weight-bold mb-0">
														{ isLoading && "?" }
														{ !isLoading && commaSeparateNumber(userFaves) }
													</span>
												</div>
												<Col className="col-auto">
													<div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
														<i className="fas fa-heart" />
													</div>
												</Col>
											</Row>
											<p className="mt-3 mb-0 text-muted text-sm">
												<span className="text-success mr-2">
													<i className="fas fa-arrow-up" /> 1.00%
												</span>{" "}
												<span className="text-nowrap">Since yesterday</span>
											</p>
										</CardBody>
									</Card>
								</Col>
								<Col lg="6" xl="3">
									<Card className="card-stats mb-4 mb-xl-0">
										<CardBody>
											<Row>
												<div className="col">
													<CardTitle
														tag="h5"
														className="text-uppercase text-muted mb-0"
													>
														Comments
													</CardTitle>
													<span className="h2 font-weight-bold mb-0">
														{ isLoading && "?" }
														{ !isLoading && commaSeparateNumber(userComments) }
													</span>
												</div>
												<Col className="col-auto">
													<div className="icon icon-shape bg-info text-white rounded-circle shadow">
														<i className="fas fa-comment" />
													</div>
												</Col>
											</Row>
											<p className="mt-3 mb-0 text-muted text-sm">
												<span className="text-warning mr-2">
													<i className="fas fa-arrow-down" /> 1.00%
												</span>{" "}
												<span className="text-nowrap">Since last month</span>
											</p>
										</CardBody>
									</Card>
								</Col>
							</Row>
						)}
					</div>
					{!!actions && (
						<div>{actions}</div>
					)}
				</Container>
			</div>
		</>
	);
};

export default Header;
