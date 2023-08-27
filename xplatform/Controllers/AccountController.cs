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
    public class AccountController : ControllerBase
    {
        private readonly XContext _context;

        public AccountController(XContext context)
        {
            _context = context;
        }
        // GET api/account
        [HttpGet]
        public IEnumerable<Account> Get()
        {
            return _context.AccountSet.ToList();
        }
    }
}