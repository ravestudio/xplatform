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
    public class ETFController : ControllerBase
    {
        private readonly XContext _context;

        public ETFController(XContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<ETF> Get()
        {
            return _context.ETFSet.ToList();
        }
    }
}