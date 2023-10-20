using CommonLib.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PriceUpdater.commands
{
    public class StateSecurityUpdate
    {
        private readonly UpdaterStorage _storage = null;
        public StateSecurityUpdate(UpdaterStorage storage)
        {
            this._storage = storage;
        }
        public string Exec(string message)
        {
            var msg = System.Text.Json.JsonSerializer.Deserialize<IList<Security>>(message);

            if (msg != null)
            {

                _storage.UpdateSecurities(msg);

            }

            return "ok";
        }
    }
}
