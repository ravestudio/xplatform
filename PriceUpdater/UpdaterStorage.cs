using CommonLib.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PriceUpdater
{
    public class UpdaterStorage
    {
        public UpdaterStorage() {
            _currentQuotes = new List<Quote>();
            _securities = new List<Security>();
        }

        private IList<Quote> _currentQuotes;
        private IList<Security> _securities;
        public IList<Quote> GetCurrentQuotes ()
        {
            return _currentQuotes;
        }
        public IList<Security> GetSecurities()
        {
            return _securities;
        }

        public void UpdateCurrentQuotes(IList<Quote> currentQuotes)
        {
            _currentQuotes = currentQuotes;
        }

        public void UpdateSecurities(IList<Security> securities)
        {
            _securities = securities;
        }
    }
}
