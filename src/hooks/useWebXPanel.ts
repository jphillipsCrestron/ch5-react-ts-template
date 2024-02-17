/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

type WebXPanelConfig = {
  host: string;
  ipId: string;
  roomId?: string;
  authToken?: string;
};

const useWebXPanel = (params: WebXPanelConfig) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const { WebXPanel, isActive, WebXPanelEvents, WebXPanelConfigParams } = window.WebXPanel.getWebXPanel(!window.WebXPanel.runsInContainerApp());
  
    setIsActive(isActive);
  
    const config: Partial<typeof WebXPanelConfigParams> = params;
  
    if (isActive) {
      console.log("Initializing XPanel with config: " + JSON.stringify(config));
      WebXPanel.initialize(config);
  
      const connectWsListener = () => {
        console.log("WebXPanel websocket connection success");
      };
  
      const errorWsListener = ({ detail }: any) => {
        console.log(`WebXPanel websocket connection error: ${JSON.stringify(detail)}`);
      };
  
      const connectCipListener = () => {
        console.log("WebXPanel CIP connection success");
      };
  
      const authenticationFailedListener = ({ detail }: any) => {
        console.log(`WebXPanel authentication failed: ${JSON.stringify(detail)}`);
      };
  
      const notAuthorizedListener = ({ detail }: any) => {
        console.log(`WebXPanel not authorized: ${JSON.stringify(detail)}`);
        window.location = detail.redirectTo;
      };
  
      const disconnectWsListener = ({ detail }: any) => {
        console.log(`WebXPanel websocket connection lost: ${JSON.stringify(detail)}`);
      };
  
      const disconnectCipListener = ({ detail }: any) => {
        console.log(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`);
      };
  
      // Adding event listeners
      window.addEventListener(WebXPanelEvents.CONNECT_WS, connectWsListener);
      window.addEventListener(WebXPanelEvents.ERROR_WS, errorWsListener);
      window.addEventListener(WebXPanelEvents.CONNECT_CIP, connectCipListener);
      window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, authenticationFailedListener);
      window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, notAuthorizedListener);
      window.addEventListener(WebXPanelEvents.DISCONNECT_WS, disconnectWsListener);
      window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, disconnectCipListener);
  
      // Cleanup function
      return () => {
        window.removeEventListener(WebXPanelEvents.CONNECT_WS, connectWsListener);
        window.removeEventListener(WebXPanelEvents.ERROR_WS, errorWsListener);
        window.removeEventListener(WebXPanelEvents.CONNECT_CIP, connectCipListener);
        window.removeEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, authenticationFailedListener);
        window.removeEventListener(WebXPanelEvents.NOT_AUTHORIZED, notAuthorizedListener);
        window.removeEventListener(WebXPanelEvents.DISCONNECT_WS, disconnectWsListener);
        window.removeEventListener(WebXPanelEvents.DISCONNECT_CIP, disconnectCipListener);
      };
    }
  }, [params]);

  return { isActive };
};

export default useWebXPanel;