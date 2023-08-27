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
    [Authorize]
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
            //TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Russian Standard Time");
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Moscow");

            deal.Date = TimeZoneInfo.ConvertTimeFromUtc(deal.Date, cstZone);
            deal.DeliveryDate = TimeZoneInfo.ConvertTimeFromUtc(deal.DeliveryDate, cstZone);

            _context.DealSet.Add(deal);

            _context.SaveChanges();

            return Ok();
        }

        [HttpGet]
        public IEnumerable<Deal> Get()
        {
            List<Deal> deals = null;

            try
            {
                deals = _context.DealSet.OrderBy(d => d.Number).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return deals;
        }


    }
}