import React from "react";
import { Card, CardHeader, Row, CardBody, Col, Container, NavLink } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { LoadingIcon } from "../../atoms";
import { useParams } from "react-router-dom";
import { NavLink as NavLinkRRD } from "react-router-dom";
import notFoundImage from "../../assets/img/not_found.jpg";
import { commaSeparateNumber } from "../../util/numbers";
import { useQuery } from "react-query";
import { getPhoto } from "../../infra/photos";

export const PhotoDetails: React.FC = () => {
	const { firebaseUser } = useAuth();
	const { id } = useParams();

	const { data: photo, isLoading } = useQuery("photo", () => getPhoto(id, firebaseUser.uid));

	return (
		<Card className="shadow">
			<CardHeader className="bg-transparent">
				<Row className="align-items-center justify-content-between">
					<div>
						<h6 className="text-uppercase text-muted ls-1 mb-1">
							Photo from Flickr
						</h6>
						<h2 className="mb-0">{photo ? photo.title : "The photo not found"}</h2>
					</div>
					<div>
						<NavLink
							to={"/user/photos"}
							tag={NavLinkRRD}
							className="text-orange"
						>
							<i className="ni ni-bold-left" />
							&nbsp;Back to photos
						</NavLink>
					</div>
				</Row>
			</CardHeader>
			<CardBody>
				<div
					style={{ display: "flex", flexWrap: "wrap", position: "relative" }}
				>
					{isLoading && <LoadingIcon minHeight={200} />}

					{!isLoading && !photo && (
						<div>
							<img src={notFoundImage} alt="Not Found" />
						</div>
					)}

					{!isLoading && photo && (
						<Container>
							<Row className="mb-3">
								<Col lg="4" sm="12">
							    <Row>
										<Col xs="6" lg="auto">
											<i className="fas fa-eye"></i>
											<span className="lg-12"> Views: </span>
										</Col>
										<Col xs="6" lg="auto" className="pl-0">
											{commaSeparateNumber(photo.totalViews)}
										</Col>
									</Row>
								</Col>
								<Col lg="4" sm="12">
									<Row>
										<Col xs="6" lg="auto">
											<i className="ni ni-favourite-28"></i>
											<span className="lg-12"> Faves: </span>
										</Col>
										<Col xs="6" lg="auto" className="pl-0">
											{commaSeparateNumber(photo.totalFaves)}
										</Col>
									</Row>
								</Col>
								<Col lg="4" sm="12">
									<Row>
										<Col xs="6" lg="auto">
											<i className="ni ni-chat-round"></i>
											<span className="lg-12"> Comments: </span>
										</Col>
										<Col xs="6" lg="auto" className="pl-0">
											{commaSeparateNumber(photo.totalComments)}
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<img
									src={`https://live.staticflickr.com/${photo.server}/${id}_${photo.secret}_b.jpg`}
									alt="Flickr"
									className="w-100"
								/>
							</Row>
						</Container>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
