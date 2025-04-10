import React from "react";
import { useQuery } from "react-query";
import { useParams, NavLink as NavLinkRRD } from "react-router-dom";
import {
	Card,
	CardHeader,
	Row,
	CardBody,
	Col,
	Container,
	NavLink,
} from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import { LoadingIcon, VerticalGauge } from "../../atoms";
import Pie from "../../molecules/Pie";
import usePhotoApis from "../../infra/photos";
import { ApiInstance } from "../../types/apis";
import notFoundImage from "../../assets/img/not_found.jpg";
import useUserApis from "../../infra/users";
import { User } from "@flickr-dashboard/core/src/types";

export const PhotoDetails: React.FC = () => {
	const { getPhoto } = usePhotoApis();
	const { getUserInfo } = useUserApis();

	const { firebaseUser } = useAuth();
	const { id } = useParams();

	const { data: photo, isLoading } = useQuery(ApiInstance.GetPhoto, () =>
		getPhoto(id, firebaseUser.uid)
	);
	const { data: user } = useQuery(ApiInstance.GetUser, () => getUserInfo(firebaseUser.uid));
	const { minViews = 0, minFaves = 0, minComments = 0, maxViews = 1, maxFaves = 1, maxComments = 1 } = user as User;

	return (
		<Card className="shadow">
			<CardHeader className="bg-transparent">
				<Row className="align-items-center justify-content-between">
					<div>
						<h6 className="text-uppercase text-muted ls-1 mb-1">
							Photo from Flickr
						</h6>
						<h2 className="mb-0">
							{photo ? photo.title : "The photo not found"}
						</h2>
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
							<Row className="d-none d-md-flex">
								<Container className="d-flex justify-content-center">
									<Row className="w-100 align-items-center">
										<Col md={3}>
											<Pie percentage={photo.interestRate} colour={"red"} />
										</Col>
										<Col md={3}>
											<VerticalGauge min={minViews} max={maxViews} mean={(minViews + maxViews) / 2} value={photo.totalViews} title="Views" icon="fas fa-eye" />
										</Col>
										<Col md={3}>
											<VerticalGauge min={minFaves} max={maxFaves} mean={(minFaves + maxFaves) / 2} value={photo.totalFaves} title="Faves" icon="ni ni-favourite-28" />
										</Col>
										<Col md={3}>
											<VerticalGauge min={minComments} max={maxComments} mean={(minComments + maxComments) / 2} value={photo.totalComments} title="Comments" icon="ni ni-chat-round" />
										</Col>
									</Row>
								</Container>
							</Row>
							<Row>
								<img
									src={`https://live.staticflickr.com/${photo.server}/${id}_${photo.secret}_b.jpg`}
									alt="Flickr"
									className="w-100"
								/>
							</Row>
							<Row className="d-md-none">
								<Container className="d-flex justify-content-center">
									<Row className="w-100 align-items-center">
										<Col xs={12}>
											<Pie percentage={photo.interestRate} colour={"red"} />
										</Col>
										<Col xs={4}>
											<VerticalGauge min={minViews} max={maxViews} mean={(minViews + maxViews) / 2} value={photo.totalViews} title="Views" icon="fas fa-eye" />
										</Col>
										<Col xs={4}>
											<VerticalGauge min={minFaves} max={maxFaves} mean={(minFaves + maxFaves) / 2} value={photo.totalFaves} title="Faves" icon="ni ni-favourite-28" />
										</Col>
										<Col xs={4}>
											<VerticalGauge min={minComments} max={maxComments} mean={(minComments + maxComments) / 2} value={photo.totalComments} title="Comments" icon="ni ni-chat-round" />
										</Col>
									</Row>
								</Container>
							</Row>
						</Container>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
