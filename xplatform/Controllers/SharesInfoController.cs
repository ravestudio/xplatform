using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.ISS;
using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharesInfoController : ControllerBase
    {
        private readonly XContext _context;

        public SharesInfoController(XContext context)
        {
            _context = context;
        }
        public IEnumerable<ShareInfo> Get()
        {
            return _context.SecuritySet.Where(s => s.Market == "shares" && s.Region == "Moscow").Select(s => new ShareInfo()
            {
                Code = s.Code,
                Emitent = s.Emitent.Name,
                Price = 0
            }).ToArray();
        }
    }
}