import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingIcon } from "../../atoms";
import { Button, Col, Form, FormGroup, Input, Row } from "reactstrap";

export const FlickrUserPrompt: React.FC = () => {
	const { firebaseUser, getFlickrUserName, setFlickrUser } = useAuth();
	const flickrUserName = getFlickrUserName();
	const [userName, setUserName] = useState(flickrUserName);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const saveInfo = async () => {
		if (userName) {
			setIsLoading(true);
			const token = await firebaseUser.getIdToken();
			await axios.get("https://checkflickrusername-ag5w5dzqxq-uc.a.run.app", {
				params: { userName: userName },
				headers: {
					"Content-Type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// const flickrUserId = response.data.flickrUserId;
			setFlickrUser(userName);
			setIsLoading(false);
			navigate("/user/index");
		}
	};

	return (
		<div style={{ position: "relative" }}>
			{isLoading && <LoadingIcon minHeight={100} />}

			<Form>
				<FormGroup>
					<Row>
						<Col xl="4" lg="6" md="8" sm="8" xs="12">
							<Input
								id="FlickrUserId"
								type="text"
								placeholder="Flickr User Name"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && saveInfo()}
							/>
						</Col>

						<Col xl="2" lg="3" md="4" sm="4" xs="12" className="mt-3 mt-sm-0 px-3 py-0 m-0">
							<Button
								className="btn-icon btn-3 w-100"
								color="primary"
								type="button"
								onClick={saveInfo}
							>
								<span className="btn-inner--icon">
									<i className="ni ni-check-bold" />
								</span>
								<span className="btn-inner--text">Save</span>
							</Button>
						</Col>
					</Row>
				</FormGroup>
			</Form>
		</div>
	);
};
