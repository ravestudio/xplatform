using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

            Security security = null;

            try
            {
                security = _context.SecuritySet.Include(s => s.Dividends).Single(s => s.FinancialPage == code);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return security.Dividends;
        }
    }
}
