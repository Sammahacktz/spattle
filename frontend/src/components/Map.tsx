import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface SimpleMapProps {
    position: [number, number];
}

export const SimpleMap: React.FC<SimpleMapProps> = ({ position }) => {
    return (
        <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%', borderRadius: 8 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={position}>
                <Popup>Dein Standort</Popup>
            </Marker>
        </MapContainer>
    );
};