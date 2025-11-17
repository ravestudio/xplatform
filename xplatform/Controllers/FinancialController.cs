using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using CommonLib.Objects;
using Iot.Device.Ft4222;
using Iot.Device.Mcp25xxx.Register.ErrorDetection;
using Iot.Device.Mcp3428;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using xplatform.DataAccess;
using xplatform.Helpers;
using xplatform.Model;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace xplatform.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FinancialController : ControllerBase
    {

        private readonly XContext _context;
        public FinancialController(XContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Financial> Get()
        {
            return _context.FinancialSet.OrderBy(f => f.Year).ToList();
        }

        [HttpGet("{id}")]
        public Financial Get(int id)
        {
            var financial = _context.FinancialSet.Include(f => f.Emitent).SingleOrDefault(f => f.Id == id);

            financial.EmitentCode = financial.Emitent.Code;

            financial.Emitent = null;

            return financial;
        }

        [HttpPost]
        public IActionResult LoadStored([FromBody] FinancialRequest request)
        {
            var buildHelper = new FinancialHelpers();

            var annuals  = _context.FinanceAnnualSet.Where(f => f.Code == request.Code && request.Years.Contains(f.Year)).ToList();

            var security = _context.SecuritySet.Include(s => s.FinancialData).SingleOrDefault(s => s.FinancialPage == request.Code);

            var financialData = security?.FinancialData != null ? JObject.Parse(security.FinancialData.Data) : null;

            var factor = buildHelper.GetFactor(request.Unit);

            AddFinancialModel model = new AddFinancialModel()
            {
                code = request.Code,
                unit = request.Unit,
                currency = financialData != null? (string)financialData["financialCurrency"] : null,
                financials = new List<AddFinancialItem>()
            };


            foreach (var annual in annuals)
            {
                model.financials.Add(new AddFinancialItem()
                {
                    year = annual.Year,
                    data = buildHelper.GetModel(JObject.Parse(annual.Data), factor)

                });
            }


            var options = new JsonSerializerOptions();


            string json = JsonSerializer.Serialize(model, options);

            return Ok(json);

        }

        [HttpPost]
        public IActionResult Post([FromBody] AddFinancialModel addModel)
        {
            var buildHelper = new FinancialHelpers();

            var factor = buildHelper.GetFactor(addModel.unit);

            foreach (var financial in addModel.financials)
            {

                JObject reportData = new JObject(
                    new JProperty("incomeStatement", buildHelper.GetStatement<IIncomeStatement>(financial.data, factor)),
                    new JProperty("balanceSheet", buildHelper.GetStatement<IBalanceSheet>(financial.data, factor)),
                    new JProperty("cashflowStatement", buildHelper.GetStatement<ICashflowStatement>(financial.data, factor))
                    );

                CommonLib.Objects.FinanceAnnual report = new FinanceAnnual()
                {
                    Id = Guid.NewGuid(),
                    Code = addModel.code,
                    Year = financial.year,
                    CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    Data = reportData.ToString()
                };

                var annual = _context.FinanceAnnualSet.SingleOrDefault(f => f.Code == report.Code && f.Year == report.Year);

                //удалить старый отчет
                /*if (annual != null)
                {
                    _context.FinanceAnnualSet.Remove(annual);
                }*/

                if (annual == null)
                {

                    _context.FinanceAnnualSet.Add(report);
                }

                //Console.WriteLine(report);
            }

            _context.SaveChanges();

            return Ok();
        }

        [HttpPut]
        public IActionResult Put([FromBody] Financial financial)
        {
            _context.FinancialSet.Update(financial);
            _context.SaveChanges();

            return Ok();
        }
    }
}