export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Station {
    id: string;
    name: string;
    coordinates: Coordinates;
}

export type TrainStatus = 'ON_TIME' | 'DELAYED' | 'STOPPED';

export interface TrainSchedule {
    stationId: string;
    arrivalTime: string; // HH:mm format
    departureTime: string; // HH:mm format
    platform: string; // e.g., "PF 1"
}

export interface Train {
    id: string;
    name: string;
    line: 'Western' | 'Central' | 'Harbour';
    source: string;
    destination: string;
    schedule: TrainSchedule[];
    crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'SUPER_DENSE';
    status: TrainStatus;
    speed: number; // km/h
    nextStationId: string;
    coordinates: Coordinates;
    heading: number; // 0-360 degrees
}
