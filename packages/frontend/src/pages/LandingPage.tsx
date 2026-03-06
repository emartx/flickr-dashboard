export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="page-header">
        <div className="page-header-image" />
        <div className="content-center">
          <div className="row">
            <div className="col-lg-5 col-md-8 ml-auto mr-auto text-center">
              <h1 className="title">Welcome to Flickr Dashboard</h1>
              <h4 className="description">Your one-stop solution for all your needs.</h4>
              <div className="buttons">
                <a href="/auth/login" className="btn btn-primary btn-round">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
