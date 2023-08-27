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
    public class BondController : ControllerBase
    {
        private readonly XContext _context;

        public BondController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Bond> Get()
        {
            return _context.BondSet.ToList();
        }
    }
}