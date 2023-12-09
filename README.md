# CH5 Vite+React+TypeScript SPA project demo

This project is a minimal demonstration of turning a Vite project with React + TypeScript acting as a single page application into a CH5 project.

## Usage
Run `npm i` to install all dependencies.

Run the `build` script to build the project.

Run the `archive` script to package the contents of the /dist/ directory into a .ch5z that can be loaded onto a control system or panel.

Run the `deploy:xpanel` script to upload the .ch5z to the control system as a WebXPanel. Adjust the IP address to match your control system.

Run the `deploy:panel` script to upload the .ch5z to a touch panel as local project. Adjust the IP address to match your panel.

## Requirements
 - You must have Node.js 20.04.0 or higher and NPM 9.7.2 or higher. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)
 - The control system must have SSL enabled with authentication credentials created. For more information see [Control System Configuration](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/Platforms/X-CS-Settings.htm)
 - At the time of writing CH5 projects are only supported on 3 and 4-series processors (including VC-4), TST-1080, X60, and X70 panels, and the Crestron One app. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)

## The entry point

The entry point is where the Crestron libraries will be loaded into the application. In this demo App.tsx is treated as the entry point for the Crestron libraries.

### Initialize the WebXPanel library if running in a browser:
```ts
   useWebXPanel("0.0.0.0", "0x03");
```

### Receive data via joins from the control system:
```ts
   useEffect(() => {
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
```

### Send data via joins to the control system:
```ts
  const sendDigital = (value: boolean) => window.CrComLib.publishEvent('b', '1', value);
  const sendAnalog = (value: number) => window.CrComLib.publishEvent('b', '1', value);
  const sendSerial = (value: string) => window.CrComLib.publishEvent('b', '1', value);
```