using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityController : ControllerBase
    {
        private readonly XContext _context;
        private readonly Serilog.ILogger _logger = null;

        public SecurityController(XContext context, Serilog.ILogger logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet]
        public IEnumerable<Security> Get()
        {
            return _context.SecuritySet.ToList();

        }

        [HttpGet("{code}")]
        public object Get(string code)
        {
            _logger.Information(code);
            var sec = from security in _context.SecuritySet
                      join emitent in _context.EmitentSet on security.EmitentId equals emitent.Id
                      join quote in _context.QuoteSet on security.Code equals quote.symbol
                      where security.Code == code
                      select new
                      {
                          security.Code,
                          security.Name,
                          security.ISIN,
                          quote.figi,
                          emitent = emitent.Name,
                          emitentCode = emitent.Code,
                          emitent.FinancialPage,

                      };

            return sec.FirstOrDefault();
        }

        [HttpDelete]
        public IActionResult Delete([FromBody]Security security)
        {
            return Ok();

        }

        [HttpPost]
        public IActionResult Post([FromBody] UpdateModel requestModel)
        {
            var security = _context.SecuritySet.Include(s => s.Emitent).SingleOrDefault(s => s.Code == requestModel.Code);
            var quote = _context.QuoteSet.SingleOrDefault(q => q.symbol == requestModel.Code);
            var raw = _context.SecurityRawSet.SingleOrDefault(q => q.ticker == requestModel.Code);

            if (raw != null)
            {
                _context.SecurityRawSet.Remove(raw);
            }

            SecurityRaw newRaw = null;

            if (raw != null) {
                newRaw = new SecurityRaw()
                {
                    isin = raw.isin,
                    figi = raw.figi,
                    ticker = raw.ticker,
                    minPriceIncrement = raw.minPriceIncrement,
                    lot = raw.lot,
                    currency = raw.currency,
                    name = raw.name,
                    type = raw.type,
                    Processed = raw.Processed,
                    Board = raw.Board,
                    Emitent = raw.Emitent,
                };
            };

            if (requestModel.Values.ContainsKey("code"))
            {
                security.Code = requestModel.Values["code"];


                if (quote != null)
                {
                    quote.symbol = requestModel.Values["code"];
                }

                var indexCmp = _context.MarketIndexComponentSet.SingleOrDefault(c => c.Code == requestModel.Code);

                if (indexCmp != null)
                {
                    indexCmp.Code = requestModel.Values["code"];
                }

                if (newRaw != null)
                {
                    newRaw.ticker = requestModel.Values["code"];
                }
            }

            if (requestModel.Values.ContainsKey("name"))
            {
                security.Name = requestModel.Values["name"];
                newRaw.name = requestModel.Values["name"];
            }

            if (requestModel.Values.ContainsKey("isin"))
            {
                security.ISIN = requestModel.Values["isin"];
                newRaw.isin = requestModel.Values["isin"];

            }

            if (requestModel.Values.ContainsKey("figi"))
            {
                if (quote != null)
                {
                    quote.figi = requestModel.Values["figi"];
                }

                if (newRaw != null)
                {
                    newRaw.figi = requestModel.Values["figi"];
                }
            }

            if (requestModel.Values.ContainsKey("emitent"))
            {
                security.Emitent.Name = requestModel.Values["emitent"];
            }

            if (requestModel.Values.ContainsKey("emitentCode"))
            {
                security.Emitent.Code = requestModel.Values["emitentCode"];
            }

            if (requestModel.Values.ContainsKey("financialPage"))
            {
                string newFinPage = requestModel.Values["financialPage"];

                var financialRaw = _context.YahooFinanceRawSet.Where(f => f.Code == security.Emitent.FinancialPage).ToList();

                financialRaw.ForEach(r => r.Code = newFinPage);

                var financial = _context.FinanceAnnualSet.Where(f => f.Code == security.Emitent.FinancialPage).ToList();
                financial.ForEach(r => r.Code = newFinPage);

                security.Emitent.FinancialPage = newFinPage;
            }


            //_context.SaveChanges();
            if (newRaw != null)
            {
                _context.SecurityRawSet.Add(newRaw);
            }
            _context.SaveChanges();



            return Ok();
        }
    }
}