using CommonLib.Objects;
using Messaging.Messages;
using System.Collections.Generic;


namespace PriceUpdater.commands
{
    public class StateYahooFinancialUpdate
    {
        private readonly UpdaterStorage _storage = null;
        public StateYahooFinancialUpdate(UpdaterStorage storage)
        {
            this._storage = storage;
        }
        public string Exec(string message)
        {
            var msg = System.Text.Json.JsonSerializer.Deserialize<IList<YahooFinancial>>(message);

            if (msg != null)
            {

                _storage.UpdateYahooFinancials(msg);

            }

            return "ok";
        }
    }
}
