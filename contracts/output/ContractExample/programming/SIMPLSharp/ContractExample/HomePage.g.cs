using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace ContractExample
{
    public interface IHomePage
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> DigitalEvent;
        event EventHandler<UIEventArgs> AnalogEvent;
        event EventHandler<UIEventArgs> StringEvent;

        void DigitalState(HomePageBoolInputSigDelegate callback);
        void AnalogState(HomePageUShortInputSigDelegate callback);
        void StringState(HomePageStringInputSigDelegate callback);

    }

    public delegate void HomePageBoolInputSigDelegate(BoolInputSig boolInputSig, IHomePage homePage);
    public delegate void HomePageUShortInputSigDelegate(UShortInputSig uShortInputSig, IHomePage homePage);
    public delegate void HomePageStringInputSigDelegate(StringInputSig stringInputSig, IHomePage homePage);

    internal class HomePage : IHomePage, IDisposable
    {
        #region Standard CH5 Component members

        private ComponentMediator ComponentMediator { get; set; }

        public object UserObject { get; set; }

        public uint ControlJoinId { get; private set; }

        private IList<BasicTriListWithSmartObject> _devices;
        public IList<BasicTriListWithSmartObject> Devices { get { return _devices; } }

        #endregion

        #region Joins

        private static class Joins
        {
            internal static class Booleans
            {
                public const uint DigitalEvent = 1;

                public const uint DigitalState = 1;
            }
            internal static class Numerics
            {
                public const uint AnalogEvent = 1;

                public const uint AnalogState = 1;
            }
            internal static class Strings
            {
                public const uint StringEvent = 1;

                public const uint StringState = 1;
            }
        }

        #endregion

        #region Construction and Initialization

        internal HomePage(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.DigitalEvent, onDigitalEvent);
            ComponentMediator.ConfigureNumericEvent(controlJoinId, Joins.Numerics.AnalogEvent, onAnalogEvent);
            ComponentMediator.ConfigureStringEvent(controlJoinId, Joins.Strings.StringEvent, onStringEvent);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        #endregion

        #region CH5 Contract

        public event EventHandler<UIEventArgs> DigitalEvent;
        private void onDigitalEvent(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = DigitalEvent;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void DigitalState(HomePageBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.DigitalState], this);
            }
        }

        public event EventHandler<UIEventArgs> AnalogEvent;
        private void onAnalogEvent(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = AnalogEvent;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void AnalogState(HomePageUShortInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].UShortInput[Joins.Numerics.AnalogState], this);
            }
        }

        public event EventHandler<UIEventArgs> StringEvent;
        private void onStringEvent(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = StringEvent;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void StringState(HomePageStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.StringState], this);
            }
        }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "HomePage", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            DigitalEvent = null;
            AnalogEvent = null;
            StringEvent = null;
        }

        #endregion

    }
}
