const StatsCard = ({
  title,
  value,
  icon,
  color,
  presentToday,
  absentToday,
}) => {
  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div
        className={`card border-start border-5 border-${color} shadow rounded-4 h-100`}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-2">
                {title}
              </h6>

              <h2 className="fw-bold mb-0">
                {value}
              </h2>

              {/* Show Present and Absent only for Attendance */}
              {title === "Attendance" ? (
                <div className="mt-2">
                  <small className="text-success me-3">
                    ✓ Present: {presentToday}
                  </small>

                  <small className="text-danger">
                    ✗ Absent: {absentToday}
                  </small>
                </div>
              ) : (
                <small className="text-success">
                  Live Data
                </small>
              )}
            </div>

            <div className={`fs-1 text-${color}`}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;