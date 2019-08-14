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
        public IEnumerable<Deal> Get()
        {
            return _context.DealSet.ToList();
        }


    }
}