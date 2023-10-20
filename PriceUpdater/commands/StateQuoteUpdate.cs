using CommonLib.ISS;
using CommonLib.Objects;
using CommonLib.Yahoo;
using Messaging.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PriceUpdater.commands
{
    public class StateQuoteUpdate
    {
        private readonly UpdaterStorage _storage = null;
        public StateQuoteUpdate(UpdaterStorage storage)
        {
            this._storage = storage;
        }
        public string Exec(string message)
        {
            var msg = System.Text.Json.JsonSerializer.Deserialize<IList<Quote>>(message);

            if (msg != null)
            {

                _storage.UpdateCurrentQuotes(msg);

            }

            return "ok";
        }
    }
}
