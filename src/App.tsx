import './assets/App.css'
import { useState, useEffect, useMemo } from 'react';
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

  const webXPanelConfig = useMemo(() => ({
    ipId: '0x03',
    host: '0.0.0.0',
    roomId: '',
    authToken: ''
  }), []); // Dependencies array is empty, so this object is created only once

  useWebXPanel(webXPanelConfig);

  useEffect(() => {
    // Listen for digital, analog, and serial joins 1 from the control system.
    // d1Id, a1Id, and s1Id are the subscription IDs for each join, they do not
    // carry any values and are only used to unsubscribe from the join when the
    // component unmounts
    const d1Id = window.CrComLib.subscribeState('b', '1', (value: boolean) => setDigitalState(value));
    const a1Id = window.CrComLib.subscribeState('n', '1', (value: number) => setAnalogState(value));
    const s1Id = window.CrComLib.subscribeState('s', '1', (value: string) => setSerialState(value));

    return () => {
      // Unsubscribe from digital, analog, and serial joins 1 when component unmounts
      window.CrComLib.unsubscribeState('b', '1', d1Id);
      window.CrComLib.unsubscribeState('n', '1', a1Id);
      window.CrComLib.unsubscribeState('s', '1', s1Id);
    }
  }, []);

  // Send digital, analog, and serial 1 joins to the control system
  const sendDigital = (value: boolean) => window.CrComLib.publishEvent('b', '1', value);
  const sendAnalog = (value: number) => window.CrComLib.publishEvent('n', '1', value);
  const sendSerial = (value: string) => window.CrComLib.publishEvent('s', '1', value);

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
