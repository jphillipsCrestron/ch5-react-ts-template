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

## Contracts
A [contract](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/CE-Overview.htm) is a document that defines how the elements in a UI will interact with a control system program. The Contract Editor outputs programming files for SIMPL Windows and C#, as well as an interface (.cse2j) file for a UI project to reference to interact with said programming files. This allows a UI and program to use descriptive names in a program; so rather than "digital join 1" a UI can reference "HomePage.Lighting.AllOff", which is much easier to read and understand at a glance.

A contract interface (.cse2j) file can be used at both build and run time. At build time the contract file is referenced by the CH5 `archive` script (see [package.json](package.json)), while at run time it must be placed in `/config/contract.cse2j` (named exactly) at the root level of the served files.

## CH5 Web Components
The Crestron HTML5 library (CH5, CrComLib) includes [purpose built HTML5 tags](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/UI-QS-Common-Attribute-Property.htm) (web components) that can be included in HTML markup. These web components include things like `ch5-button` and `ch5-dpad`. In an HTML5 project that uses a standard framework such as React these components are not generally necessary and aren't as flexible as JSX. However, there are some components that cannot be reproduced in React such as the `ch5-video` for displaying RTSP streams on Crestron touchpanels and the Crestron One app. For that reason this project does support the use of CH5 components. The [globals.d.ts](/src/globals.d.ts) file contains bindings to map the CH5 web components to the JSX interface so they can be used without error and maintain type safety.

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

   // Contracts
   const dc1Id = window.CrComLib.subscribeState('b', 'HomePage.DigitalState', (value: boolean) => setDigitalContractState(value));
   const ac1Id = window.CrComLib.subscribeState('n', 'HomePage.AnalogState', (value: number) => setAnalogContractState(value));
   const sc1Id = window.CrComLib.subscribeState('s', 'HomePage.StringState', (value: string) => setSerial

   return () => {
      // Unsubscribe from digital, analog, and serial joins 1 when component unmounts
      window.CrComLib.unsubscribeState('b', '1', d1Id);
      window.CrComLib.unsubscribeState('n', '1', a1Id);
      window.CrComLib.unsubscribeState('s', '1', s1Id);

      // Contracts
      window.CrComLib.unsubscribeState('b', 'HomePage.DigitalState', dc1Id);
      window.CrComLib.unsubscribeState('n', 'HomePage.AnalogState', ac1Id);
      window.CrComLib.unsubscribeState('s', 'HomePage.StringState', sc1Id);
   }
}, []);
```

### Send data via joins to the control system:
```ts
const sendDigital = (value: boolean) => window.CrComLib.publishEvent('b', '1', value);
const sendAnalog = (value: number) => window.CrComLib.publishEvent('n', '1', value);
const sendSerial = (value: string) => window.CrComLib.publishEvent('s', '1', value);

// Contracts
const sendDigitalContract = (value: boolean) => window.CrComLib.publishEvent('b', 'HomePage.DigitalEvent', value);
const sendAnalogContract = (value: number) => window.CrComLib.publishEvent('n', 'HomePage.AnalogEvent', value);
const sendSerialContract = (value: string) => window.CrComLib.publishEvent('s', 'HomePage.StringEvent', value);
```

### Using CH5 components
```tsx
// Import a CH5 theme (coming from the @crestron/ch5-theme package) for CH5 CSS (required when a CH5 component is in use)
// If not using a CH5 component in the project then do not import the CSS as that adds ~2mb to the bundle size.
import '@crestron/ch5-theme/output/themes/light-theme.css'

function App() {
   return (
      <div>
         <p>I'm regular JSX!</p>
         <ch5-button type="info" label="I'm a CH5 button!"></ch5-button>
         <ch5-video 
            url="rtsp://0.0.0.0:554" 
            userId='username' 
            password='password' 
            size="regular">
         </ch5-video>
      <div/>
   )
}
```