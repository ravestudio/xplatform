using CommonLib.Objects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly XContext _context;

        public NotesController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Note> Get(string code)
        {
            List<Note> notes = null;

            try
            {
                var security = _context.SecuritySet.Single(s => s.FinancialPage == code);

                notes = _context.NoteSet.Where(n => n.EmitentId == security.EmitentId).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return notes;
        }

        [HttpPost]
        public IActionResult Post([FromBody] AddNoteModel requestModel)
        {
            var security = _context.SecuritySet.Include(s => s.Emitent).Single(s => s.FinancialPage == requestModel.Code);

            Note note = new Note()
            {
                Id = Guid.NewGuid(),
                ChangeDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                EmitentId = security.EmitentId,
                Data = requestModel.Data,

            };

            _context.NoteSet.Add(note);

            _context.SaveChanges();


            return Ok();
        }
    }
}
