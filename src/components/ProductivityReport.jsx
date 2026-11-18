
function ProductivityReport({
  exportPeriod,
  onChangePeriod,
  reportPeriodTitle,
  onPreviousPeriod,
  onNextPeriod,
  totalTasks,
  completedTasks,
  pendingTasks,
  completionRate,
  canvasRef,
  onDownload,
}) {
  return (
    <section className="productivity-export-section">
      <div className="productivity-export-heading">
        <h2>Productivity Report</h2>
        <p>Review your productivity and track your progress.</p>
      </div>

      <div className="export-period-selector">
        <button
          type="button"
          className={exportPeriod === 'weekly' ? 'active' : ''}
          onClick={() => onChangePeriod('weekly')}
        >
          Weekly
        </button>

        <button
          type="button"
          className={exportPeriod === 'monthly' ? 'active' : ''}
          onClick={() => onChangePeriod('monthly')}
        >
          Monthly
        </button>
      </div>

      <div className="export-period-navigation">
        <button
          type="button"
          onClick={onPreviousPeriod}
          aria-label="Previous reporting period"
        >
          ‹
        </button>

        <h3>{reportPeriodTitle}</h3>

        <button
          type="button"
          onClick={onNextPeriod}
          aria-label="Next reporting period"
        >
          ›
        </button>
      </div>

      <div className="export-summary-grid">
        <div className="export-summary-card">
          <span>Total Tasks</span>
          <strong>{totalTasks}</strong>
        </div>

        <div className="export-summary-card">
          <span>Completed</span>
          <strong>{completedTasks}</strong>
        </div>

        <div className="export-summary-card">
          <span>Pending</span>
          <strong>{pendingTasks}</strong>
        </div>

        <div className="export-summary-card">
          <span>Completion Rate</span>
          <strong>{completionRate}%</strong>
        </div>
      </div>

      <div className="productivity-preview-heading">
        <h3>Report Preview</h3>
      </div>

      <div className="productivity-canvas-container">
        <canvas
          ref={canvasRef}
          className="productivity-canvas"
        />
      </div>

      <button
        type="button"
        className="download-productivity-button"
        onClick={onDownload}
      >
        Download PNG Report
      </button>

      <p className="export-note">
        Your productivity report is ready to download and share.
      </p>
    </section>
  );
}

export default ProductivityReport;
