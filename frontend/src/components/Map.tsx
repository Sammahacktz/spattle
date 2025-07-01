import { Icon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
interface SimpleMapProps {
    position: [number, number];
}

const MapUpdater: React.FC<{ position: [number, number] }> = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
};

export const SimpleMap: React.FC<SimpleMapProps> = ({ position }) => {
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ width: "1000px", height: "500px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <MapUpdater position={position} />
        </MapContainer>
    );
};