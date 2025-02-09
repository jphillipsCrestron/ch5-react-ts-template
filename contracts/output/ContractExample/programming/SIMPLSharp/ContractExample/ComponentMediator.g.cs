using System;
using System.Collections.Generic;
using System.Globalization;
using Crestron.SimplSharpPro;

namespace ContractExample
{
    internal class ComponentMediator : IDisposable
    {
        #region Members

        private readonly IList<SmartObject> _smartObjects;
        private IList<SmartObject> SmartObjects { get { return _smartObjects; } }

        private readonly Dictionary<string, Action<SmartObjectEventArgs>> _booleanOutputs;
        private Dictionary<string, Action<SmartObjectEventArgs>> BooleanOutputs { get { return _booleanOutputs; } }

        private readonly Dictionary<string, Action<SmartObjectEventArgs>> _numericOutputs;
        private Dictionary<string, Action<SmartObjectEventArgs>> NumericOutputs { get { return _numericOutputs; } }

        private readonly Dictionary<string, Action<SmartObjectEventArgs>> _stringOutputs;
        private Dictionary<string, Action<SmartObjectEventArgs>> StringOutputs { get { return _stringOutputs; } }

        #endregion

        #region Construction & Initialization

        public ComponentMediator()
        {
            _smartObjects = new List<SmartObject>();

            _booleanOutputs = new Dictionary<string, Action<SmartObjectEventArgs>>();
            _numericOutputs = new Dictionary<string, Action<SmartObjectEventArgs>>();
            _stringOutputs = new Dictionary<string, Action<SmartObjectEventArgs>>();
        }

        public void HookSmartObjectEvents(SmartObject smartObject)
        {
            SmartObjects.Add(smartObject);
            smartObject.SigChange += SmartObject_SigChange;
        }
        public void UnHookSmartObjectEvents(SmartObject smartObject)
        {
            SmartObjects.Remove(smartObject);
            smartObject.SigChange -= SmartObject_SigChange;
        }

        #endregion

        #region Smart Object Event Handler

        private string GetKey(uint smartObjectId, uint join)
        {
            return smartObjectId.ToString(CultureInfo.InvariantCulture) + "." + join.ToString(CultureInfo.InvariantCulture);
        }

        internal void ConfigureBooleanEvent(uint controlJoinId, uint join, Action<SmartObjectEventArgs> action)
        {
            string key = GetKey(controlJoinId, join);
            if (BooleanOutputs.ContainsKey(key))
                BooleanOutputs[key] = action;
            else
                BooleanOutputs.Add(key, action);
        }
        internal void ConfigureNumericEvent(uint controlJoinId, uint join, Action<SmartObjectEventArgs> action)
        {
            string key = GetKey(controlJoinId, join);
            if (NumericOutputs.ContainsKey(key))
                NumericOutputs[key] = action;
            else
                NumericOutputs.Add(key, action);

        }
        internal void ConfigureStringEvent(uint controlJoinId, uint join, Action<SmartObjectEventArgs> action)
        {
            string key = GetKey(controlJoinId, join);
            if (StringOutputs.ContainsKey(key))
                StringOutputs[key] = action;
            else
                StringOutputs.Add(key, action);
        }

        private void SmartObject_SigChange(GenericBase currentDevice, SmartObjectEventArgs args)
        {
            try
            {
                Dictionary<string, Action<SmartObjectEventArgs>> signals = null;
                switch (args.Sig.Type)
                {
                    case eSigType.Bool:
                        signals = BooleanOutputs;
                        break;
                    case eSigType.UShort:
                        signals = NumericOutputs;
                        break;
                    case eSigType.String:
                        signals = StringOutputs;
                        break;
                }

                //Resolve and invoke the corresponding method
                Action<SmartObjectEventArgs> action;
                string key = GetKey(args.SmartObjectArgs.ID, args.Sig.Number);
                if (signals != null && 
                    signals.TryGetValue(key, out action) &&
                    action != null)
                    action.Invoke(args);
            }
            catch
            {
            }
        }

        #endregion

        #region IDisposable

        private bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            for (int i = 0; i < SmartObjects.Count; i++)
            {
                SmartObjects[i].SigChange -= SmartObject_SigChange;
            }
        }

        #endregion
    }
}