export default function LoadingScreen({ progress, visible }) {
  return (
    <div className={`loading-screen ${!visible ? 'hidden' : ''}`}>
      <div className="loading-logo">VOIL</div>
      <div className="loading-tagline">Avocado Oil Extraction</div>
      <div className="loading-bar-container">
        <div 
          className="loading-bar" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="loading-percent">{progress}%</div>
    </div>
  );
}
