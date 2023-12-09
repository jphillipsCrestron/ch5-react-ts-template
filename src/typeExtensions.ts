import * as CrComLib from '@crestron/ch5-crcomlib';

declare global {
  interface Window {
    CrComLib: typeof CrComLib;
  }
}

interface CrComLibType {
    CrComLib: typeof CrComLib;
}

// Assign to window object
window.CrComLib = (CrComLib as unknown as CrComLibType).CrComLib;