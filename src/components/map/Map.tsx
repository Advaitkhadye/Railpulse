import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import type { Train } from '../../types';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { TrainFront } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TRACK_COORDINATES } from '../../lib/data';

interface MapProps {
    trains: Train[];
    selectedTrainId: string | null;
    onTrainSelect: (trainId: string) => void;
}

// Custom icon factory
const createTrainIcon = (color: string, heading: number, isSelected: boolean) => {
    const iconMarkup = renderToStaticMarkup(
        <div className="relative w-8 h-8 flex items-center justify-center transform" style={{ transform: `rotate(${heading}deg)` }}>
            <div className={`w-8 h-8 rounded-full bg-white border-2 ${color} flex items-center justify-center shadow-lg ${isSelected ? 'scale-125 ring-2 ring-blue-500' : ''}`}>
                <TrainFront size={20} className="text-gray-800" />
            </div>
        </div>
    );

    return divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

export function Map({ trains, selectedTrainId, onTrainSelect }: MapProps) {
    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={[19.0760, 72.8777]} // Mumbai coordinates
                zoom={11}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Track Lines */}
                <Polyline
                    positions={TRACK_COORDINATES.Western as [number, number][]}
                    pathOptions={{ color: '#ef4444', weight: 3, opacity: 0.6, dashArray: '10, 10' }}
                />
                <Polyline
                    positions={TRACK_COORDINATES.Central as [number, number][]}
                    pathOptions={{ color: '#eab308', weight: 3, opacity: 0.6, dashArray: '10, 10' }}
                />
                <Polyline
                    positions={TRACK_COORDINATES.Harbour as [number, number][]}
                    pathOptions={{ color: '#a855f7', weight: 3, opacity: 0.6, dashArray: '10, 10' }}
                />

                {trains.map((train) => {
                    const isSelected = train.id === selectedTrainId;
                    const color = train.status === 'DELAYED' ? 'border-red-500' : 'border-green-500';

                    return (
                        <Marker
                            key={train.id}
                            position={[train.coordinates.lat, train.coordinates.lng]}
                            icon={createTrainIcon(color, train.heading, isSelected)}
                            eventHandlers={{
                                click: () => onTrainSelect(train.id),
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px]">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{train.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${train.status === 'ON_TIME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {train.status === 'ON_TIME' ? 'On Time' : 'Late'}
                                        </span>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <p className="text-gray-600 font-medium">{train.source} → {train.destination}</p>
                                        <p className="text-blue-600">Next: {train.nextStationId.replace('st-', '').toUpperCase()}</p>
                                        <p className="text-xs text-gray-500">Speed: {Math.round(train.speed)} km/h</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
