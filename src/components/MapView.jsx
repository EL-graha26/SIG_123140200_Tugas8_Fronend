import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import api from '../config/api';

function MapView() {
    const [geojsonData, setGeojsonData] = useState(null);

    useEffect(() => {
        const fetchGeoJSON = async () => {
            try {
                const response = await api.get('/data/geojson');
                setGeojsonData(response.data);
            } catch (error) {
                console.error("Gagal mengambil data wisata:", error);
            }
        };
        fetchGeoJSON();
    }, []);

    // 1. Pewarnaan Berdasarkan Kategori Wisata
    const getStyle = (feature) => {
        const kategori = feature.properties.kategori?.toLowerCase() || '';
        let mapColor = "#64748b"; // Default Abu-abu

        if (kategori.includes("pantai") || kategori.includes("laut")) mapColor = "#0284c7"; // Biru
        else if (kategori.includes("gunung") || kategori.includes("alam")) mapColor = "#16a34a"; // Hijau
        else if (kategori.includes("sejarah") || kategori.includes("budaya")) mapColor = "#b45309"; // Coklat
        else if (kategori.includes("kuliner")) mapColor = "#e11d48"; // Merah

        return { color: mapColor, weight: 2, fillColor: mapColor, fillOpacity: 0.9 };
    };

    // 2. Tampilan Titik Marker
    const pointToLayer = (feature, latlng) => {
        const style = getStyle(feature);
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: style.fillColor,
            color: "#ffffff",
            weight: 2.5,
            opacity: 1,
            fillOpacity: 1
        });
    };

    // 3. Popup & Interaksi Hover
    const onEachFeature = (feature, layer) => {
        const { nama, kategori, alamat, rating, fasilitas } = feature.properties;
        const color = getStyle(feature).color;
        
        // Format teks fasilitas
        let fasText = "Tidak ada data";
        if (fasilitas && fasilitas.length > 0) {
            fasText = fasilitas.join(", ");
        }

        const popupContent = `
            <div style="font-family: sans-serif; width: 220px;">
                <h3 style="margin: 0 0 5px 0; color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px;">${nama}</h3>
                <p style="margin: 5px 0; font-size: 13px;"><b>Kategori:</b> <span style="background: ${color}; color: white; padding: 2px 5px; border-radius: 4px;">${kategori}</span></p>
                <p style="margin: 5px 0; font-size: 13px;"><b>Rating:</b> ⭐ ${rating}/5.0</p>
                <p style="margin: 5px 0; font-size: 12px; color: #555;"><b>Lokasi:</b> ${alamat || '-'}</p>
                <p style="margin: 5px 0; font-size: 11px; color: #777;"><i>Fasilitas: ${fasText}</i></p>
            </div>
        `;
        layer.bindPopup(popupContent);

        // Event: Hover Highlight membesar
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ radius: 12, weight: 3 });
                e.target.bringToFront();
            },
            mouseout: (e) => {
                e.target.setStyle({ radius: 8, weight: 2.5 });
            }
        });
    };

    return (
        <MapContainer 
            center={[-5.42, 105.26]} // Center di Bandar Lampung
            zoom={12} 
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geojsonData && (
                <GeoJSON 
                    data={geojsonData} 
                    style={getStyle} 
                    pointToLayer={pointToLayer} 
                    onEachFeature={onEachFeature} 
                />
            )}
        </MapContainer>
    );
}

export default MapView;