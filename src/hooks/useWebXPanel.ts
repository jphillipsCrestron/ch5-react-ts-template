/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel'

const useWebXPanel = (host: string, ipId: string, roomId?: string) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const { WebXPanel, isActive, WebXPanelEvents, WebXPanelConfigParams } = getWebXPanel(!runsInContainerApp());

    setIsActive(isActive);

    const config: Partial<typeof WebXPanelConfigParams> = { host, ipId, roomId, };

    if (isActive) {
        console.log("Initializing XPanel with config: " + JSON.stringify(config));
        WebXPanel.initialize(config);

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
    }

  }, [host, ipId, roomId]);

  return { isActive };
};

export default useWebXPanel;