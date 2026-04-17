import MapView from './components/MapView'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Peta Wisata Bandar Lampung</h1>
        <p>Eksplorasi Destinasi Alam, Sejarah, dan Kuliner</p>
      </header>
      
      <main className="map-wrapper">
        <MapView />
        
        <div className="map-legend">
          <h4>Kategori Wisata</h4>
          <div className="legend-item"><span className="dot pantai"></span> Pantai / Laut</div>
          <div className="legend-item"><span className="dot alam"></span> Alam / Gunung</div>
          <div className="legend-item"><span className="dot sejarah"></span> Sejarah / Budaya</div>
          <div className="legend-item"><span className="dot kuliner"></span> Kuliner</div>
        </div>
      </main>
    </div>
  )
}

export default App