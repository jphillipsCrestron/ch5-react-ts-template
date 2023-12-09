import * as CrComLib from '@crestron/ch5-crcomlib';
import { 
  bridgeReceiveBooleanFromNative, 
  bridgeReceiveIntegerFromNative, 
  bridgeReceiveObjectFromNative, 
  bridgeReceiveStringFromNative,
 } from '@crestron/ch5-crcomlib';

declare global {
  interface Window {
    CrComLib: typeof CrComLib;
    bridgeReceiveBooleanFromNative: typeof bridgeReceiveBooleanFromNative;
    bridgeReceiveIntegerFromNative: typeof bridgeReceiveIntegerFromNative;
    bridgeReceiveObjectFromNative: typeof bridgeReceiveObjectFromNative;
    bridgeReceiveStringFromNative: typeof bridgeReceiveStringFromNative;
  }
}

interface CrComLibType {
    CrComLib: typeof CrComLib;
}

// Assign to window object
window.CrComLib = (CrComLib as unknown as CrComLibType).CrComLib;

// Assign the bridge receive methods to the window object
window.bridgeReceiveBooleanFromNative = bridgeReceiveBooleanFromNative;
window.bridgeReceiveIntegerFromNative = bridgeReceiveIntegerFromNative;
window.bridgeReceiveStringFromNative = bridgeReceiveStringFromNative;
window.bridgeReceiveObjectFromNative = bridgeReceiveObjectFromNative;