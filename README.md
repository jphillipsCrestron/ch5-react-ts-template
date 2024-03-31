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
 - The control system must have SSL and authentication enabled. For more information see [Control System Configuration](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/Platforms/X-CS-Settings.htm)
 - At the time of writing CH5 projects are only supported on 3 and 4-series processors (including VC-4), TST-1080, X60, and X70 panels, and the Crestron One app. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)

## Authentication
Historically authenticating a CH5 session is handled by a redirect initiated by the WebXPanel library to the processor/server authentication service. However since CH5 2.8.0 an authentication token can be created on the processor/server instead of requiring manual user input for authentication. For processors (4-series only) this is handled via the ```websockettoken generate``` command. On VirtualControl servers the token is generated in the [web interface](https://docs.crestron.com/en-us/8912/content/topics/configuration/Web-Configuration.htm?#Tokens)

## The entry point
The entry point is where the Crestron libraries (UMD) will be loaded into the application. In this demo index.html is treated as the entry point for the Crestron libraries.

## Progressive Web App (PWA)
Progressive web apps are HTML5 apps that can be "installed" on devices from browsers onto PC/Mac/iOS/Android devices. Browsers require strict security to perform this - so the server must serve the project via HTTPS and the server certificate must be signed by a CA that is trusted by the client device. See the wiki for this demo which details [how to create a certificate chain](https://github.com/jphillipsCrestron/ch5-react-ts-template/wiki/Creating-a-certificate-chain-(for-PWA)). PWA's are defined via a manifest JSON file which describes the PWA, and a service worker js file that is responsible for caching files for later retrieval in the event that the device loses network connectivity to the server so the user will still see the project.
This demo uses the [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) package to generate a manifest and service worker with the parameters defined in the [vite.config.ts](vite.config.ts) file, which goes into more detail about each parameter and requirements. For more information on PWA's in general, refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).

### Initialize the WebXPanel library if running in a browser:
```ts
const webXPanelConfig = useMemo(() => ({
   ipId: '0x03',
   host: '0.0.0.0',
   roomId: '',
   authToken: ''
}), []);

useWebXPanel(webXPanelConfig);
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
const sendAnalog = (value: number) => window.CrComLib.publishEvent('n', '1', value);
const sendSerial = (value: string) => window.CrComLib.publishEvent('s', '1', value);
```