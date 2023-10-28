import './App.css'
import { useState, useEffect } from 'react';
import CrComLib from '@crestron/ch5-crcomlib';
import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';

// Bind CrComLib to the window object
(window as any).CrComLib = (CrComLib as any).CrComLib;

// Retrieve the XPanel and associated objects
const { WebXPanel, isActive, WebXPanelConfigParams, WebXPanelEvents } = getWebXPanel(!runsInContainerApp());

// If the project is running in a browser the XPanel should initialize
if (isActive) {
  WebXPanelConfigParams.host = "192.168.1.223";
  WebXPanelConfigParams.ipId = "0x03";

  console.log("Initializing XPanel with config: " + JSON.stringify(WebXPanelConfigParams));
  WebXPanel.initialize(WebXPanelConfigParams);
}

function App() {
  const [digitalState, setDigitalState] = useState(false);
  const [analogState, setAnalogState] = useState(0);
  const [serialState, setSerialState] = useState("");

  useEffect(() => {
    // Listen for digital, analog, and serial joins 1 from the control system
    (window as any)["CrComLib"].subscribeState('b', '1', (value: boolean) => setDigitalState(value));
    (window as any)["CrComLib"].subscribeState('n', '1', (value: number) => setAnalogState(value));
    (window as any)["CrComLib"].subscribeState('s', '1', (value: string) => setSerialState(value));

    // Listen for XPanel events
    window.addEventListener(WebXPanelEvents.CONNECT_WS, () => {
      console.log("WebXPanel websocket connection success");
    });

    window.addEventListener(WebXPanelEvents.ERROR_WS, ({ detail }: any) => {
      console.log(`WebXPanel websocket connection error: ${JSON.stringify(detail)}`);
    });

    window.addEventListener(WebXPanelEvents.CONNECT_CIP, () => {
      console.log("WebXPanel CIP connection success");
    });

    window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, ({ detail }: any) => {
      console.log(`WebXPanel authentication failed: ${JSON.stringify(detail)}`);
    });

    window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, ({ detail }: any) => {
      console.log(`WebXPanel not authorized: ${JSON.stringify(detail)}`);
      window.location = detail.redirectTo;
    });

    window.addEventListener(WebXPanelEvents.DISCONNECT_WS, ({ detail }: any) => {
      console.log(`WebXPanel websocket connection lost: ${JSON.stringify(detail)}`);
    });

    window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, ({ detail }: any) => {
      console.log(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`);
    });
  }, []);

  // Send digital, analog, and serial 1 joins to the control system
  const sendDigital = (value: boolean) => (window as any)["CrComLib"].publishEvent('b', '1', value);
  const sendAnalog = (value: number) => (window as any)["CrComLib"].publishEvent('b', '1', value);
  const sendSerial = (value: string) => (window as any)["CrComLib"].publishEvent('b', '1', value);

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
