import { useState, useEffect } from 'react';
import { TrainList } from '../components/TrainList';
import { Map } from '../components/map/Map';
import { INITIAL_TRAINS, simulateTrainMovement } from '../lib/data';
import type { Train } from '../types';
import { UserProfile } from '../components/UserProfile';


export function Dashboard() {
    const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
    const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
    const [isMobileListExpanded, setIsMobileListExpanded] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTrains(currentTrains => simulateTrainMovement(currentTrains));
        }, 1000); // Update every second

        return () => clearInterval(intervalId);
    }, []);

    const handleTrainSelect = (trainId: string) => {
        setSelectedTrainId(trainId);
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-900 text-white">
            {/* Mobile Toggle Button (Floating) */}
            {!isMobileListExpanded && (
                <button
                    onClick={() => setIsMobileListExpanded(true)}
                    className="md:hidden absolute top-4 left-4 z-30 p-3 bg-slate-900 text-white rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            )}

            {/* User Profile Card */}
            <UserProfile />

            {/* Sidebar / Side Drawer Container */}
            <div
                className={`
          absolute z-40 transition-transform duration-300 ease-in-out shadow-2xl h-full bg-white
          /* Desktop Styles */
          md:left-0 md:top-0 md:w-96 md:border-r md:border-gray-200 md:translate-x-0
          /* Mobile Styles */
          top-0 left-0 w-80
          ${isMobileListExpanded ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <TrainList
                    trains={trains}
                    selectedTrainId={selectedTrainId}
                    onTrainSelect={handleTrainSelect}
                    onToggleMobileExpand={() => setIsMobileListExpanded(!isMobileListExpanded)}
                />
            </div>

            {/* Mobile Backdrop */}
            {isMobileListExpanded && (
                <div
                    className="md:hidden absolute inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileListExpanded(false)}
                />
            )}

            {/* Map Container */}
            <div className="h-full w-full z-0">
                <Map
                    trains={trains}
                    selectedTrainId={selectedTrainId}
                    onTrainSelect={handleTrainSelect}
                />
            </div>
        </div>
    );
}
