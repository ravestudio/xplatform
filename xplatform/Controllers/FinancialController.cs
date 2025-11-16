using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonLib.Objects;
using Iot.Device.Ft4222;
using Iot.Device.Mcp25xxx.Register.ErrorDetection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using xplatform.DataAccess;
using xplatform.Helpers;
using xplatform.Model;

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
        public AddFinancialModel LoadStored([FromBody] FinancialRequest request)
        {
            var buildHelper = new FinancialHelpers();

            var annuals  = _context.FinanceAnnualSet.Where(f => f.Code == request.Code && request.Years.Contains(f.Year)).ToList();

            AddFinancialModel model = new AddFinancialModel()
            {
                Code = request.Code,
                Financials = new List<AddFinancialItem>()
            };


            foreach (var annual in annuals)
            {
                model.Financials.Add(new AddFinancialItem()
                {
                    Year = annual.Year,
                    Data = buildHelper.GetModel(JObject.Parse(annual.Data))

                });
            }

            return model;

        }

        [HttpPost]
        public IActionResult Post([FromBody] AddFinancialModel addModel)
        {
            var buildHelper = new FinancialHelpers();

            var factor = buildHelper.GetFactor(addModel.Unit);

            foreach (var financial in addModel.Financials)
            {

                JObject reportData = new JObject(
                    new JProperty("incomeStatement", buildHelper.GetStatement<IIncomeStatement>(financial.Data, factor)),
                    new JProperty("balanceSheet", buildHelper.GetStatement<IBalanceSheet>(financial.Data, factor)),
                    new JProperty("cashflowStatement", buildHelper.GetStatement<ICashflowStatement>(financial.Data, factor))
                    );

                CommonLib.Objects.FinanceAnnual report = new FinanceAnnual()
                {
                    Id = Guid.NewGuid(),
                    Code = addModel.Code,
                    Year = financial.Year,
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