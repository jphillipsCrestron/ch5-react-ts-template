# CH5 Vite+React+TypeScript SPA project demo

This project is a minimal demonstration of turning a Vite project with React + TypeScript acting as a single page application into a CH5 project.

## Usage

Run the `build` script to transpile the TypeScript & invoke the Vite build process.

Run the `archive` script to package the contents of the /dist/ directory into a .ch5z that can be loaded onto a control system or panel.

Run the `upload:xpanel` script to upload the .ch5z to the control system as a WebXPanel. Adjust the IP address to match your control system.

Run the `upload:panel` script to upload the .ch5z to a touch panel as local project. Adjust the IP address to match your panel.

## Requirements
 - You must have Node.js 20.04.0 or higher and NPM 9.7.2 or higher. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)
 - The control system must have SSL enabled with authentication credentials created. For more information see [Control System Configuration](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/Platforms/X-CS-Settings.htm)
 - At the time of writing CH5 projects are only supported on 3 and 4-series processors (including VC-4), TST-1080, X60, and X70 panels, and the Crestron One app. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)

## The entry point

The entry point is where the Crestron libraries will be loaded into the application. In this demo App.tsx is treated as the entry point for the Crestron libraries.

### Import the Crestron libraries:
```ts
   import CrComLib from '@crestron/ch5-crcomlib';
   import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';
```

### Bind the CrComLib to the Window object:
```ts
   (window as any).CrComLib = (CrComLib as any).CrComLib;
```

### Get the WebXPanel objects:
```ts
   const { WebXPanel, isActive, WebXPanelConfigParams, WebXPanelEvents } = getWebXPanel(!runsInContainerApp());
```

### Initialize the WebXPanel library if running in a browser:
```ts
   if (isActive) {
      WebXPanelConfigParams.host = "1.1.1.1"; // Adjust to match the IP of the control system
      WebXPanelConfigParams.ipId = "0x03"; // Adjust to the correct IPID of the WebXPanel

      console.log("Initializing XPanel with config: " + JSON.stringify(WebXPanelConfigParams));
      WebXPanel.initialize(WebXPanelConfigParams);
   }
```

### Receive data via joins from the control system:
```ts
   useEffect(() => {
      (window as any)["CrComLib"].subscribeState('b', '1', (value: boolean) => setDigitalState(value));
      (window as any)["CrComLib"].subscribeState('n', '1', (value: number) => setAnalogState(value));
      (window as any)["CrComLib"].subscribeState('s', '1', (value: string) => setSerialState(value));
   }, []);
```

### Send data via joins to the control system:
```ts
  const sendDigital = (value: boolean) => (window as any)["CrComLib"].publishEvent('b', '1', value);
  const sendAnalog = (value: number) => (window as any)["CrComLib"].publishEvent('b', '1', value);
  const sendSerial = (value: string) => (window as any)["CrComLib"].publishEvent('b', '1', value);
```