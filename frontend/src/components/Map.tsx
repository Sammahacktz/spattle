// SimpleMap.tsx
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix Leaflet marker icon issue:
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

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