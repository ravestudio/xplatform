using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IncomeController : ControllerBase
    {
        private readonly XContext _context;

        public IncomeController(XContext context)
        {
            _context = context;
        }

        [HttpGet("{year}")]
        public IEnumerable<Income> Get(int year)
        {
            return _context.IncomeSet.Where(i => i.paymentDate.Year == year);
        }

    }
}
