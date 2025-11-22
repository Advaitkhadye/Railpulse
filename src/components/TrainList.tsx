import { useState } from 'react';
import type { Train } from '../types';
import { Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { calculateETA, getNextStations } from '../lib/utils';

interface TrainListProps {
    trains: Train[];
    selectedTrainId: string | null;
    onTrainSelect: (trainId: string) => void;
    isMobileExpanded?: boolean;
    onToggleMobileExpand?: () => void;
}

export function TrainList({ trains, selectedTrainId, onTrainSelect, isMobileExpanded = false, onToggleMobileExpand }: TrainListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTrainId, setExpandedTrainId] = useState<string | null>(null);

    const filteredTrains = trains.filter(train =>
        train.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (e: React.MouseEvent, trainId: string) => {
        e.stopPropagation();
        setExpandedTrainId(expandedTrainId === trainId ? null : trainId);
    };

    return (
        <div className="h-full flex flex-col bg-white w-full md:w-96 text-gray-900 font-sans">
            <div className="p-4 md:p-6 bg-slate-900 text-white shadow-lg relative overflow-hidden shrink-0">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-4 md:mb-6 relative z-10">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="RailPulse Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight">RailPulse</h1>
                        <p className="text-[10px] md:text-xs text-blue-200 font-medium tracking-wide uppercase">Live Train Tracker</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onToggleMobileExpand}
                        className="md:hidden ml-auto p-2 text-slate-400 hover:text-white bg-white/5 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="relative z-10">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search train, station..."
                        className="w-full bg-slate-800/50 text-white pl-10 pr-4 py-2 md:py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400 text-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
                {filteredTrains.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No trains found.</p>
                    </div>
                ) : (
                    filteredTrains.map((train) => {
                        const nextStop = getNextStations(train, 1)[0];
                        const eta = nextStop ? calculateETA(train, nextStop.stationId) : '--';
                        const isExpanded = expandedTrainId === train.id;

                        return (
                            <div
                                key={train.id}
                                onClick={() => onTrainSelect(train.id)}
                                className={`border-b border-gray-200 bg-white cursor-pointer transition-all hover:bg-blue-50 ${selectedTrainId === train.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="p-3 md:p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${train.line === 'Western' ? 'bg-red-600' :
                                                    train.line === 'Central' ? 'bg-yellow-600' :
                                                        'bg-purple-600'
                                                    }`}>{train.line[0]}</span>
                                                <h3 className="font-bold text-base md:text-lg text-gray-800">{train.source} <ArrowRight size={14} className="inline mx-1" /> {train.destination}</h3>
                                            </div>
                                            <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                                <span className="font-semibold text-blue-700">Next: {nextStop?.stationId.replace('st-', '').toUpperCase() || 'End'}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-green-600 font-medium">ETA: {eta}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded ${train.status === 'ON_TIME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {train.status === 'ON_TIME' ? 'On Time' : 'Late'}
                                            </span>
                                            <button
                                                onClick={(e) => toggleExpand(e, train.id)}
                                                className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="bg-gray-50 p-3 border-t border-gray-200 text-sm">
                                        <h4 className="font-semibold text-gray-500 mb-2 text-xs uppercase tracking-wider">Upcoming Stops</h4>
                                        <div className="space-y-2">
                                            {getNextStations(train, 5).map((stop, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-gray-700">
                                                    <span>{stop.stationId.replace('st-', '').toUpperCase()}</span>
                                                    <span className="font-mono text-gray-500">{stop.arrivalTime}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
