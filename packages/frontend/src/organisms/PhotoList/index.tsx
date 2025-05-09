import React, { useEffect } from "react";
import { Card, CardHeader, Row, CardBody, Button, Container, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LoadingIcon, ProgressBar } from "../../atoms";
import { usePhotos } from "../../hooks/usePhotos";
import usePhotoApis from "../../infra/photos";
import "./styles.css";
import { Photo, PhotoFlickr } from "@flickr-dashboard/core/src/types";
import { SmallStats } from "../../molecules/SmallStats";

export const PhotoList: React.FC = () => {
	const { firebaseUser, getFlickrUserName } = useAuth();
	const flickrUserName = getFlickrUserName();
	const navigate = useNavigate();
	const { getRecentPhotos, saveNewPhotos } = usePhotoApis();

	const { data: photos, isLoading, error } = usePhotos(firebaseUser?.uid);
	const errorMessage = (error as Error)?.message;

	const getNewPhotos = async (recentPhotos: PhotoFlickr[]) => {
		if (!photos || photos?.length === 0) return [];

		const photoIds = photos?.map((photo: Photo) => photo.id);
		const newPhotos = recentPhotos.filter(
			(photo: PhotoFlickr) => !photoIds?.includes(photo.id)
		);
		return newPhotos;
	}

	useEffect(() => {
		if (photos?.length === 0) return;

		(async () => {
			const recentPhotos = await getRecentPhotos();
			if (! recentPhotos.isDone) return;

			const newPhotos = await getNewPhotos(recentPhotos.data?.photos.photo || []);

			saveNewPhotos(newPhotos, firebaseUser.uid);
		})();

	}, [firebaseUser, photos]);

	return (
		<Card className="shadow">
			<CardHeader className="bg-transparent">
				<Row className="align-items-center">
					<div className="col">
						<h6 className="text-uppercase text-muted ls-1 mb-1">
							Photos from Flickr
						</h6>
						<h2 className="mb-0">My Photos</h2>
					</div>
				</Row>
			</CardHeader>
			<CardBody>
				<div
					style={{ display: "flex", flexWrap: "wrap", position: "relative" }}
				>
					{!flickrUserName && (
						<div>
							To view photos, you must have set a Flickr username
							&nbsp;&nbsp;
							<span className="ni ni-curved-next" />
							&nbsp;&nbsp;
							<Button
								color="primary"
								size="sm"
								type="button"
								onClick={() => (navigate("/user/set-flickr-user"))}
							>
								<span>Set Flickr User Name</span>
								&nbsp;&nbsp;
								<span className="ni ni-album-2" />
							</Button>
						</div>
					)}

					{isLoading && <LoadingIcon minHeight={200} />}

					{!isLoading && photos?.length == 0 && !!flickrUserName && (
						<div>No photos found</div>
					)}

					{!!error && errorMessage}

					<Container>
						<Row>
							{photos?.map(
								(photo) => (
									<Col key={photo.id} className="py-2 text-center photo-thumbnail" xs="6" sm="4" md="4" lg="3" xl="2">
										<div className="fixed-card-wrapper">
											<Card className="growable-card">
												<CardBody className="p-1">
													<img
														src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
														// src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`}
														alt={photo.title}
														onClick={() => navigate(`/user/photo/${photo.id}`)}
														className="w-100"
													/>
													<div className="p-2">
														<ProgressBar progressValue={photo.interestRate} />
														<SmallStats photo={photo} />
													</div>
												</CardBody>
											</Card>
										</div>
									</Col>
								)
							)}
							</Row>
						</Container>
				</div>
			</CardBody>
		</Card>
	);
};
