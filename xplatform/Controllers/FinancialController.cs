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
    public class FinancialController : ControllerBase
    {

        private readonly XContext _context;
        public FinancialController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Financial> Get()
        {
            return _context.FinancialSet.OrderBy(f => f.Year).ToList();
        }

        [HttpGet("{id}")]
        public Financial Get(int id)
        {
            var financial = _context.FinancialSet.Include(f => f.Emitent).SingleOrDefault(f => f.Id == id);

            financial.EmitentCode = financial.Emitent.Code;

            financial.Emitent = null;

            return financial;
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