using CommonLib.Helpers;
using CommonLib.Objects;
using Google.Protobuf.WellKnownTypes;
using migrationUtils.DataAccess;
using Tinkoff.InvestApi;
using Tinkoff.InvestApi.V1;

namespace migrationUtils.Migrations
{
    class LoadTinkoffDeals
    {
        private readonly string _connection;
        public LoadTinkoffDeals(string connectionString)
        {
            _connection = connectionString;

        }
        public void Execut(string account, string from, string to)
        {
            InvestApiClient client = InvestApiClientFactory.Create("t.YN2srtQ05k8DpGPN_WQ4liW0FkCpkRPTbuOyAzrujle8NxTJzrs3bxv_Q0n6PIKitvXLyKtxhK6mjqTMDTn3Vg");

            var request = new OperationsRequest {
                AccountId = account,
                From = DateTime.SpecifyKind(DateTime.Parse(from), DateTimeKind.Utc).ToTimestamp(),
                To = DateTime.SpecifyKind(DateTime.Parse(to), DateTimeKind.Utc).ToTimestamp(),
                State = OperationState.Executed
            };

            var resp = client.Operations.GetOperations(request);

            var operations = resp.Operations.Where(oper => oper.OperationType == OperationType.Buy || oper.OperationType == OperationType.Sell).OrderBy(oper => oper.Date);

            var helpers = new FinancialHelpers();

            if (operations != null) {
                using (var dbContext = new XContext(_connection))
                {
                    foreach (var operation in operations)
                    {
                        //var figi = operation.Figi == "BBG000000001" ? "TCS60A1011U5" : operation.Figi;
                        var figi = operation.Figi;

                        if (figi == string.Empty) continue;

                        var instrumentResp =client.Instruments.GetInstrumentBy(new InstrumentRequest
                        {
                            IdType = InstrumentIdType.Figi,
                            Id = figi

                        });

                        var instrument = instrumentResp.Instrument;

                        //var quote = dbContext.QuoteSet.Single(q => q.figi == figi);

                        foreach (var trade in operation.Trades)
                        {
                            var dealRaw = new DealRaw()
                            {
                                number = decimal.Parse(trade.TradeId),
                                board = instrument.ClassCode,
                                symbol = instrument.Ticker,
                                operation = operation.OperationType == OperationType.Buy ? "Купля" : "Продажа",
                                date = helpers.UnixTimeToDateTime(trade.DateTime.Seconds).ToString("dd.MM.yyyy"),
                                time = helpers.UnixTimeToDateTime(trade.DateTime.Seconds).ToString("HH:mm:ss"),
                                delivery_date = helpers.UnixTimeToDateTime(trade.DateTime.Seconds).AddDays(1).ToString("dd.MM.yyyy"),
                                price = (decimal)trade.Price,
                                count = (int)trade.Quantity,
                                volume = (decimal)trade.Price * trade.Quantity,
                                client = account


                            };

                            dbContext.DealRawSet.Add(dealRaw);
                            //
                            Console.WriteLine("{0} {1} {2} {3} {4} {5} {6} {7} {8} {9}", dealRaw.number, dealRaw.board, dealRaw.symbol, dealRaw.date, dealRaw.time, dealRaw.delivery_date, dealRaw.price, dealRaw.count, dealRaw.volume, dealRaw.client);
                        }

                    }
                    dbContext.SaveChanges();
                }


            }
        }
    }
}
