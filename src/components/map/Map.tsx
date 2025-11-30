import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import type { Train } from '../../types';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { TRACK_COORDINATES } from '../../lib/data';
import { memo, useEffect, useRef } from 'react';

interface MapProps {
    trains: Train[];
    selectedTrainId: string | null;
    onTrainSelect: (trainId: string) => void;
}

// Static SVG string to avoid React rendering overhead
const TRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-800"><path d="M16 16h1.98"/><path d="M6 16h1.98"/><path d="M5.99 2H18c.99 0 1.99.89 1.99 1.99v14c0 1.1-.99 1.99-1.99 1.99H5.99c-1.1 0-1.99-.89-1.99-1.99V3.99C4 2.89 4.89 2 5.99 2z"/><path d="M10 10h4"/><path d="M12 10v4"/><path d="M8 22v-2"/><path d="M16 22v-2"/></svg>`;

// Optimized icon factory using template literals instead of renderToStaticMarkup
const createTrainIcon = (colorClass: string, heading: number, isSelected: boolean) => {
    const selectedClass = isSelected ? 'scale-125 ring-2 ring-blue-500' : '';

    // We use a template string for maximum performance
    const html = `
        <div class="relative w-8 h-8 flex items-center justify-center transform" style="transform: rotate(${heading}deg)">
            <div class="w-8 h-8 rounded-full bg-white border-2 ${colorClass} flex items-center justify-center shadow-lg ${selectedClass}">
                ${TRAIN_SVG}
            </div>
        </div>
    `;

    return divIcon({
        html: html,
        className: 'bg-transparent',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

// Memoized Marker Component
const TrainMarker = memo(({ train, isSelected, onSelect }: { train: Train, isSelected: boolean, onSelect: (id: string) => void }) => {
    const color = train.status === 'DELAYED' ? 'border-red-500' : 'border-green-500';
    const markerRef = useRef<any>(null);

    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [isSelected]);

    return (
        <Marker
            ref={markerRef}
            position={[train.coordinates.lat, train.coordinates.lng]}
            icon={createTrainIcon(color, train.heading, isSelected)}
            eventHandlers={{
                click: () => onSelect(train.id),
            }}
        >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} className="font-bold text-sm">
                {train.source} → {train.destination}
            </Tooltip>
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
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Speed: {Math.round(train.speed)} km/h</span>
                            <span>•</span>
                            <span className={`font-bold ${train.crowdLevel === 'LOW' ? 'text-green-600' :
                                train.crowdLevel === 'MEDIUM' ? 'text-yellow-600' :
                                    train.crowdLevel === 'HIGH' ? 'text-orange-600' :
                                        'text-red-600'
                                }`}>
                                Crowd: {train.crowdLevel.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}, (prev, next) => {
    // Custom comparison to reduce re-renders if data hasn't changed significantly
    // However, coordinates change every frame, so this might not save much.
    // The main saving is removing renderToStaticMarkup.
    return (
        prev.train.id === next.train.id &&
        prev.train.coordinates.lat === next.train.coordinates.lat &&
        prev.train.coordinates.lng === next.train.coordinates.lng &&
        prev.train.heading === next.train.heading &&
        prev.isSelected === next.isSelected
    );
});

export function Map({ trains, selectedTrainId, onTrainSelect }: MapProps) {
    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={[19.0760, 72.8777]} // Mumbai coordinates
                zoom={11}
                className="h-full w-full"
                zoomControl={false}
                preferCanvas={true} // Use Canvas renderer for better performance with many markers
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={import.meta.env.VITE_MAP_TILE_URL}
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

                {trains.map((train) => (
                    <TrainMarker
                        key={train.id}
                        train={train}
                        isSelected={train.id === selectedTrainId}
                        onSelect={onTrainSelect}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
