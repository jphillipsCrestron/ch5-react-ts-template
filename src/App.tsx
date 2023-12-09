import './App.css'
import { useState, useEffect } from 'react';
import './typeExtensions'; // This is where I have CrComLib imported
import useWebXPanel from './hooks/useWebXPanel';

// Initialize eruda for panel/app debugging capabilities (in dev mode only)
if (import.meta.env.VITE_APP_ENV === 'development') {
  import('eruda').then(({ default: eruda }) => {
    eruda.init();
  });
}

function App() {
  const [digitalState, setDigitalState] = useState(false);
  const [analogState, setAnalogState] = useState(0);
  const [serialState, setSerialState] = useState("");

  useWebXPanel("192.168.1.223", "0x04", "1");

  useEffect(() => {
    // Listen for digital, analog, and serial joins 1 from the control system
    window.CrComLib.subscribeState('b', '1', (value: boolean) => setDigitalState(value));
    window.CrComLib.subscribeState('n', '1', (value: number) => setAnalogState(value));
    window.CrComLib.subscribeState('s', '1', (value: string) => setSerialState(value));
  }, []);

  // Send digital, analog, and serial 1 joins to the control system
  const sendDigital = (value: boolean) => window.CrComLib.publishEvent('b', '1', value);
  const sendAnalog = (value: number) => window.CrComLib.publishEvent('b', '1', value);
  const sendSerial = (value: string) => window.CrComLib.publishEvent('b', '1', value);

  return (
    <div id="controlGroupWrapper">
      <div className="controlGroup">
        <button id="sendDigitalButton" className="btn" onClick={() => sendDigital(!digitalState)}>Toggle Digital</button>
        <p id="currentDigitalValue">{digitalState.toString()}</p>
      </div>
      <div className="controlGroup">
          <p id="currentAnalogValue">{analogState}</p>
          <input type="range" min="0" max="65535" value={analogState} placeholder="32767" id="analogSlider" onChange={(e) => sendAnalog(Number(e.target.value))} />
      </div>
      <div className="controlGroup">
          <input type="text" name="Data" id="currentSerialValue" placeholder="Placeholder" value={serialState} onChange={(e) => sendSerial(e.target.value)} />
      </div>
    </div>
  )
}

export default App
