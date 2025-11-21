import type { Train } from '../types';

export function calculateETA(train: Train, stationId: string): string {
    const stationIndex = train.schedule.findIndex(s => s.stationId === stationId);
    if (stationIndex === -1) return '--';

    // Simple simulation: just return the scheduled time for now
    // In a real app, we'd calculate based on current lat/lng and speed
    return train.schedule[stationIndex].arrivalTime;
}

export function getNextStations(train: Train, count: number = 3) {
    const currentStationIndex = train.schedule.findIndex(s => s.stationId === train.nextStationId);
    if (currentStationIndex === -1) return [];
    return train.schedule.slice(currentStationIndex, currentStationIndex + count);
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
