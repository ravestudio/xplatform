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
    public class FinancialController : ControllerBase
    {

        private readonly XContext _context;
        public FinancialController(XContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public Financial Get(int id)
        {
            return _context.FinancialSet.SingleOrDefault(f => f.Id == id);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Financial financial)
        {
            financial.Period = 7;

            _context.FinancialSet.Add(financial);

            _context.SaveChanges();

            return Ok();
        }

        [HttpPut]
        public IActionResult Put([FromBody] Financial financial)
        {
            _context.FinancialSet.Update(financial);
            _context.SaveChanges();

            return Ok();
        }
    }
}