using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmitentController : ControllerBase
    {
        private readonly XContext _context;

        public EmitentController(XContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<Emitent> Get()
        {
            return _context.EmitentSet.ToList();
        }

        [HttpDelete]
        public IActionResult Delete([FromBody] Emitent emitent)
        {
            var data = _context.EmitentSet.Include(e => e.Securities).SingleOrDefault(e => e.Id == emitent.Id);

            //удаляем securities

            if (data != null)
            {
                foreach (var security in data.Securities)
                {
                    _context.SecuritySet.Remove(security);

                    var quote = _context.QuoteSet.SingleOrDefault(q => q.symbol == security.Code);

                    if (quote != null)
                    {
                        _context.QuoteSet.Remove(quote);
                    }

                    var raw = _context.SecurityRawSet.SingleOrDefault(r => r.isin == security.ISIN);

                    if (raw != null)
                    {
                        _context.SecurityRawSet.Remove(raw);
                    }

                }

                //удаляем financial
                var financialRaw = _context.YahooFinanceRawSet.Where(f => f.Code == emitent.FinancialPage).ToList();

                _context.YahooFinanceRawSet.RemoveRange(financialRaw);

                var financial = _context.FinanceAnnualSet.Where(f => f.Code == emitent.FinancialPage).ToList();
                _context.FinanceAnnualSet.RemoveRange(financial);

                _context.EmitentSet.Remove(data);

                _context.SaveChanges();

            }





            return Ok();

        }
    }
}