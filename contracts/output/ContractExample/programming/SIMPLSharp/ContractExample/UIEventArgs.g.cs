using System;
using Crestron.SimplSharpPro;
using Crestron.SimplSharpPro.DeviceSupport;

namespace ContractExample
{
    public class UIEventArgs : EventArgs
    {
        public BasicTriListWithSmartObject Device { get; internal set; }
        public SigEventArgs SigArgs { get; internal set; }

        internal static UIEventArgs CreateEventArgs(SmartObjectEventArgs eventArgs)
        {
            return new UIEventArgs
            {
                Device = (BasicTriListWithSmartObject)eventArgs.SmartObjectArgs.Device,
                SigArgs = eventArgs
            };
        }
    }
}