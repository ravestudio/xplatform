using CommonLib.Objects;
using Messaging.Messages;
using Microsoft.VisualBasic;
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
            _yahooFinancials = new List<YahooFinancial>();
        }

        private IList<Quote> _currentQuotes;
        private IList<Security> _securities;
        private IList<YahooFinancial> _yahooFinancials;
        public IList<Quote> GetCurrentQuotes ()
        {
            return _currentQuotes;
        }
        public IList<Security> GetSecurities()
        {
            return _securities;
        }

        public IList<YahooFinancial> GetYahooFinancials()
        {
            return _yahooFinancials;
        }

        public YahooFinancial? GetYahooFinancialRequest()
        {
            return _yahooFinancials.Where(s =>
                !string.IsNullOrEmpty(s.status) &&
                !s.status.Equals("Processed") &&
                !(s.status.Equals("Init") && s.loadDate.HasValue)
                ).FirstOrDefault();
        }

        public void UpdateCurrentQuotes(IList<Quote> currentQuotes)
        {
            _currentQuotes = currentQuotes;
        }

        public void UpdateSecurities(IList<Security> securities)
        {
            _securities = securities;
        }

        public void UpdateYahooFinancials(IList<YahooFinancial> yahooFinancials)
        {
            _yahooFinancials = yahooFinancials;
        }

        public void UpdateFinancialStatus(string code, string newStatus)
        {
            var financial = _yahooFinancials.SingleOrDefault(f => f.code == code && f.status != "Processed");
            if (financial != null)
            {
                financial.status = newStatus;
            }
        }
    }
}
