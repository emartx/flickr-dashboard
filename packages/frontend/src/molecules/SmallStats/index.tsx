import { Photo } from "@flickr-dashboard/core/src/types";
import { Container, Row } from "reactstrap";

type StatsRowProps = {
  icon: string;
  value: number;
}
const StatsRow: React.FC<StatsRowProps> = ({icon, value}) => (
  <Row className="justify-content-between" style={{ color: 'lightgray', fontSize: '0.8rem' }}>
    <i className={icon}></i>
    {value}
  </Row>
)

type SmallStatsProps = {
  photo: Photo
}
export const SmallStats: React.FC<SmallStatsProps> = ({photo}) => {
	return (
		<Container className="mt-2">
      {/* <StatsRow icon="fas fa-thermometer-full" value={photo.interestRate} /> */}
      <StatsRow icon="fas fa-eye" value={photo.totalViews} />
      <StatsRow icon="ni ni-favourite-28" value={photo.totalFaves} />
      <StatsRow icon="ni ni-chat-round" value={photo.totalComments} />
		</Container>
	);
};
