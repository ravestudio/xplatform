using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using xplatform.DataAccess;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImportController : ControllerBase
    {

        private readonly XContext _context;

        public ImportController(XContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Post([FromBody] ImportRequest requestModel)
        {
            if (requestModel.Object == "deal")
            {
                var dealRaws = _context.DealRawSet.ToList();
                var accounts = _context.AccountSet.ToList();

                foreach (DealRaw rawItem in dealRaws)
                {

                    var security = _context.SecuritySet.Single(s => s.Code == rawItem.symbol);

                    Deal deal = new Deal()
                    {
                        Number = rawItem.number,
                        Operation = rawItem.operation == "Купля" ? OrderOperationEnum.Buy : OrderOperationEnum.Sell,
                        securityId = security.Id,
                        accountId = accounts.Single(a => a.Client == rawItem.client).Id,
                        Board = rawItem.board,
                        Date = DateTime.ParseExact($"{rawItem.date} {rawItem.time}", "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                        DeliveryDate = DateTime.ParseExact(rawItem.delivery_date, "dd.MM.yyyy", CultureInfo.InvariantCulture),
                        Count = rawItem.count,
                        Price = rawItem.price,
                        Volume = rawItem.volume,
                        NKD = security.Market == "bonds" ? rawItem.nkd : null
                    };

                    _context.DealSet.Add(deal);

                }

                _context.SaveChanges();


            }

            return Ok();
        }
    }
}