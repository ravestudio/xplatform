using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MigrationController : ControllerBase
    {
        private readonly XContext _context;

        public MigrationController(XContext xcontext)
        {
            _context = xcontext;
        }

        [HttpGet]
        public string Get()
        {
            try
            {
                _context.Database.Migrate();
            }catch(Exception ex)
            {
                return ex.Message;
            }

            return "ok";
        }
    }
}