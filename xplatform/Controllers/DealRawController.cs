using System.Linq;
using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using xplatform.DataAccess;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DealRawController : ControllerBase
    {
        private readonly XContext _context;

        public DealRawController(XContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<DealRaw> Get()
        {
            return _context.DealRawSet.ToList();

        }
    }
}
