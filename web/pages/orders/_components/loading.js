export default () => (
  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
    <div className="col">
      <div className="card" aria-hidden="true">
        <div className="card-body">
          <h5 className="card-title placeholder-glow">
            <span className="placeholder col-4"></span>
          </h5>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-2"></span>
          </p>
          <a
            className="btn btn-primary btn-sm disabled placeholder col-3"
            aria-disabled="true"
          ></a>
        </div>
      </div>
    </div>
  </div>
);
