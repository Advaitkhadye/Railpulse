import { useState, useEffect } from 'react';
import { TrainList } from './components/TrainList';
import { Map } from './components/map/Map';
import { INITIAL_TRAINS, simulateTrainMovement } from './lib/data';
import type { Train } from './types';

function App() {
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);

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
      <div className="absolute left-0 top-0 h-full z-20 pointer-events-none">
        <div className="pointer-events-auto h-full">
          <TrainList
            trains={trains}
            selectedTrainId={selectedTrainId}
            onTrainSelect={handleTrainSelect}
          />
        </div>
      </div>
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

export default App;
