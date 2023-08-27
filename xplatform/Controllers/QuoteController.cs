using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using xplatform.DataAccess;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly XContext _context;

        public QuoteController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Quote> Get()
        {
            return _context.QuoteSet.ToArray();
        }

        [HttpPost]
        public IActionResult Post([FromBody] Quote quote)
        {
            quote.lastUpdate = DateTime.Now;

            _context.QuoteSet.Update(quote);

            _context.SaveChanges();

            return Ok();
        }
    }
}