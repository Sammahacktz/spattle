import polyline from '@mapbox/polyline';
import { Icon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

interface SimpleMapProps {
    stravaPolyline: string;
}

const MapUpdater: React.FC<{ polylinePositions: [number, number][] }> = ({ polylinePositions }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView(polylinePositions[0]);
    }, [polylinePositions, map]);
    return null;
};

export const SimpleMap: React.FC<SimpleMapProps> = ({ stravaPolyline }) => {
    // Decode polyline (required)
    let polylinePositions: [number, number][] = [];
    let center: [number, number] = [51.505, -0.09]; // fallback center
    try {
        polylinePositions = polyline.decode(stravaPolyline) as [number, number][];
        if (polylinePositions.length > 0) {
            center = polylinePositions[0];
        }
    } catch (e) {
        polylinePositions = [];
    }
    return (
        <MapContainer center={center} zoom={14} scrollWheelZoom={true} style={{ position: "relative", width: "100%", height: "350px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {polylinePositions.length > 0 && (
                <Polyline positions={polylinePositions} color="black" />
            )}
            {polylinePositions.length > 0 && (
                <Marker position={center} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                    <Popup>
                        Startpunkt der Strava-Aktivität
                    </Popup>
                </Marker>
            )}
            {polylinePositions.length > 1 && (
                <Marker position={polylinePositions[polylinePositions.length - 1]} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                    <Popup>
                        Endpunkt der Strava-Aktivität
                    </Popup>
                </Marker>
            )}
            <MapUpdater polylinePositions={polylinePositions} />
        </MapContainer>
    );
};