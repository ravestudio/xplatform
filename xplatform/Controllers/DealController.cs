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
    public class DealController : ControllerBase
    {
        private readonly XContext _context;

        public DealController(XContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Post([FromBody] Deal deal)
        {
            _context.DealSet.Add(deal);

            _context.SaveChanges();

            return Ok();
        }

        public IEnumerable<Deal> Get()
        {
            return _context.DealSet.OrderBy(d => d.Number).ToList();
        }


    }
}