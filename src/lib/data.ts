import type { Station, Train } from '../types';

export const STATIONS: Station[] = [
    // Western Line
    { id: 'st-ccg', name: 'Churchgate', coordinates: { lat: 18.9322, lng: 72.8264 } },
    { id: 'st-mcl', name: 'Mumbai Central', coordinates: { lat: 18.9696, lng: 72.8194 } },
    { id: 'st-ddr-w', name: 'Dadar (Western)', coordinates: { lat: 19.0178, lng: 72.8478 } },
    { id: 'st-bnd', name: 'Bandra', coordinates: { lat: 19.0544, lng: 72.8402 } },
    { id: 'st-adh', name: 'Andheri', coordinates: { lat: 19.1136, lng: 72.8697 } },
    { id: 'st-bvi', name: 'Borivali', coordinates: { lat: 19.2310, lng: 72.8566 } },
    { id: 'st-vir', name: 'Virar', coordinates: { lat: 19.4700, lng: 72.8100 } },

    // Central Line
    { id: 'st-csmt', name: 'CSMT', coordinates: { lat: 18.9400, lng: 72.8353 } },
    { id: 'st-byc', name: 'Byculla', coordinates: { lat: 18.9750, lng: 72.8335 } },
    { id: 'st-ddr-c', name: 'Dadar (Central)', coordinates: { lat: 19.0178, lng: 72.8478 } },
    { id: 'st-kur', name: 'Kurla', coordinates: { lat: 19.0657, lng: 72.8910 } },
    { id: 'st-thn', name: 'Thane', coordinates: { lat: 19.1911, lng: 72.9707 } },
    { id: 'st-kyn', name: 'Kalyan', coordinates: { lat: 19.2403, lng: 73.1305 } },

    // Harbour Line
    { id: 'st-vdl', name: 'Vadala Road', coordinates: { lat: 19.0166, lng: 72.8587 } },
    { id: 'st-chb', name: 'Chunabhatti', coordinates: { lat: 19.0510, lng: 72.8760 } },
    { id: 'st-vsh', name: 'Vashi', coordinates: { lat: 19.0770, lng: 72.9980 } },
    { id: 'st-mnk', name: 'Mankhurd', coordinates: { lat: 19.0485, lng: 72.9322 } },
    { id: 'st-pvl', name: 'Panvel', coordinates: { lat: 18.9894, lng: 73.1175 } },
];

export const TRACK_COORDINATES = {
    Western: [
        [18.9322, 72.8264], // Churchgate
        [18.9696, 72.8194], // Mumbai Central
        [19.0178, 72.8478], // Dadar
        [19.0544, 72.8402], // Bandra
        [19.1136, 72.8697], // Andheri
        [19.2310, 72.8566], // Borivali
        [19.4700, 72.8100], // Virar
    ],
    Central: [
        [18.9400, 72.8353], // CSMT
        [18.9750, 72.8335], // Byculla
        [19.0178, 72.8478], // Dadar
        [19.0657, 72.8910], // Kurla
        [19.1911, 72.9707], // Thane
        [19.2403, 73.1305], // Kalyan
    ],
    Harbour: [
        [18.9400, 72.8353], // CSMT
        [19.0166, 72.8587], // Vadala
        [19.0510, 72.8760], // Chunabhatti
        [19.0657, 72.8910], // Kurla
        [19.0485, 72.9322], // Mankhurd
        [19.0770, 72.9980], // Vashi
        [18.9894, 73.1175], // Panvel
    ]
};

// Helper to generate schedule based on a start time and station list
function generateSchedule(startTimeStr: string, stations: Station[], direction: 'UP' | 'DOWN'): any[] {
    const schedule = [];
    let currentTime = new Date();
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    currentTime.setHours(hours, minutes, 0, 0);

    const orderedStations = direction === 'DOWN' ? stations : [...stations].reverse();

    for (let i = 0; i < orderedStations.length; i++) {
        const station = orderedStations[i];
        const arrivalTime = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        // Add 1 minute for stop
        currentTime.setMinutes(currentTime.getMinutes() + 1);
        const departureTime = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        // Random platform 1-4
        const platform = `PF ${Math.floor(Math.random() * 4) + 1}`;

        schedule.push({
            stationId: station.id,
            arrivalTime,
            departureTime,
            platform
        });

        // Travel time to next station (approx 3-5 mins)
        currentTime.setMinutes(currentTime.getMinutes() + 3 + Math.floor(Math.random() * 3));
    }

    return schedule;
}

function generateTrains(): Train[] {
    const trains: Train[] = [];
    const lines = ['Western', 'Central', 'Harbour'] as const;
    const crowdLevels = ['LOW', 'MEDIUM', 'HIGH', 'SUPER_DENSE'] as const;

    let idCounter = 90001;

    lines.forEach(line => {
        // Generate 50 trains per line
        for (let i = 0; i < 50; i++) {
            const direction = i % 2 === 0 ? 'UP' : 'DOWN';
            // We need to manually select stations based on line since STATIONS is a flat list.
            let lineStations: Station[] = [];
            if (line === 'Western') {
                lineStations = STATIONS.slice(0, 7);
            } else if (line === 'Central') {
                lineStations = STATIONS.slice(7, 13);
            } else {
                // Harbour Line: CSMT -> Vadala -> Chunabhatti -> Kurla -> Mankhurd -> Vashi -> Panvel
                lineStations = [
                    STATIONS[7],  // CSMT
                    STATIONS[13], // Vadala
                    STATIONS[14], // Chunabhatti
                    STATIONS[10], // Kurla
                    STATIONS[16], // Mankhurd
                    STATIONS[15], // Vashi
                    STATIONS[17]  // Panvel
                ];
            }

            // Pick random start/end points for variety, but generally full route
            const source = direction === 'DOWN' ? lineStations[0].name : lineStations[lineStations.length - 1].name;
            const destination = direction === 'DOWN' ? lineStations[lineStations.length - 1].name : lineStations[0].name;

            // Stagger start times
            const startHour = 8 + Math.floor(i / 2); // Starts from 8 AM
            const startMinute = (i % 2) * 30 + Math.floor(Math.random() * 15);
            const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

            const schedule = generateSchedule(startTime, lineStations, direction);

            // Initial position (simplified: start at first station)
            const startStation = direction === 'DOWN' ? lineStations[0] : lineStations[lineStations.length - 1];

            trains.push({
                id: idCounter.toString(),
                name: `${destination} ${i % 3 === 0 ? 'Fast' : 'Slow'}`,
                line: line,
                status: Math.random() > 0.8 ? 'DELAYED' : 'ON_TIME',
                coordinates: { ...startStation.coordinates },
                heading: 0,
                nextStationId: schedule[1]?.stationId || schedule[0].stationId,
                source,
                destination,
                schedule,
                crowdLevel: crowdLevels[Math.floor(Math.random() * crowdLevels.length)],
                speed: Math.floor(Math.random() * 60) + 30 // Random speed 30-90 km/h
            });
            idCounter++;
        }
    });

    return trains;
}

export const INITIAL_TRAINS: Train[] = generateTrains();

// Simple simulation helper to move trains towards their next station
export function simulateTrainMovement(trains: Train[]): Train[] {
    return trains.map(train => {
        const targetStation = STATIONS.find(s => s.id === train.nextStationId);
        if (!targetStation) return train;

        const { lat: currentLat, lng: currentLng } = train.coordinates;
        const { lat: targetLat, lng: targetLng } = targetStation.coordinates;

        // Calculate direction
        const deltaLat = targetLat - currentLat;
        const deltaLng = targetLng - currentLng;
        const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);

        if (distance < 0.001) {
            // Arrived, move to next station in schedule
            const currentScheduleIdx = train.schedule.findIndex(s => s.stationId === train.nextStationId);
            const nextScheduleItem = train.schedule[currentScheduleIdx + 1];

            if (nextScheduleItem) {
                return {
                    ...train,
                    nextStationId: nextScheduleItem.stationId,
                    status: Math.random() > 0.9 ? 'DELAYED' : 'ON_TIME',
                };
            } else {
                // End of line, respawn? For now just stay
                return train;
            }
        }

        // Move towards target (simplified)
        const speedFactor = 0.0005; // Adjust for simulation speed
        const moveLat = (deltaLat / distance) * speedFactor;
        const moveLng = (deltaLng / distance) * speedFactor;

        return {
            ...train,
            coordinates: {
                lat: currentLat + moveLat,
                lng: currentLng + moveLng,
            },
            heading: Math.atan2(deltaLng, deltaLat) * (180 / Math.PI),
        };
    });
}
