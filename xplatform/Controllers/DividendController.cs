using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using xplatform.DataAccess;


namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class DividendController : ControllerBase
    {
        private readonly XContext _context;

        public DividendController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Dividend> Get(string code)
        {
            List<Dividend> dividends = null;

            try
            {
                var security = _context.SecuritySet.Single(s => s.FinancialPage == code);

                dividends = _context.DividendSet.Where(d => d.securityId == security.Id).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return dividends;
        }
    }
}
