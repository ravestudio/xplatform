﻿using CommonLib.Objects;
using CommonLib.Yahoo;
using Messaging;
using Messaging.Messages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using XCub.DataAccess;

namespace XCub
{
    public class RabbitReceiver : IHostedService
    {
        private readonly RabbitMQSettings _rabbitSettings;
        private readonly IModel _channel;

        private readonly IServiceScopeFactory _scopeFactory;
        public RabbitReceiver(IServiceScopeFactory scopeFactory, RabbitMQSettings rabbitSettings, IModel channel)
        {
            _scopeFactory = scopeFactory;
            _rabbitSettings = rabbitSettings;
            _channel = channel;
        }

        private void DoStuff()
        {
            _channel.ExchangeDeclare(exchange: _rabbitSettings.ExchangeName,
                        type: _rabbitSettings.ExchangeType);

            var queueName = _channel.QueueDeclare().QueueName;

            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "quote.update");
            //_channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "yahoo.financial");
            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "yahoo.process");
            _channel.QueueBind(queue: queueName, exchange: _rabbitSettings.ExchangeName, routingKey: "yahoo.update");

            var consumerAsync = new AsyncEventingBasicConsumer(_channel);

            consumerAsync.Received += async (_, ea) =>
            {

                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                /*if (ea.RoutingKey == "yahoo.financial")
                {
                    var msg = JsonSerializer.Deserialize<Yahoo>(message);

                    if (msg != null)
                    {
                        using (var scope = _scopeFactory.CreateScope())
                        {
                            var context = scope.ServiceProvider.GetRequiredService<XContext>();

                            var apiClient = new CommonLib.WebApiClient();
                            YahooClient yahooClient = new YahooClient(apiClient);

                            apiClient.addHeader("x-rapidapi-host", "mboum-finance.p.rapidapi.com");
                            apiClient.addHeader("x-rapidapi-key", "d8c3e2c892msh13cac0704b75eb0p115a47jsn5be47ce5097d");

                            foreach (string code in msg.Codes)
                            {
                                try
                                {

                                    string resp = await yahooClient.GetFinancial(code);

                                    JObject obj = JObject.Parse(resp);

                                    int max_timestamp = obj["incomeStatementHistory"]["incomeStatementHistory"].Select(s => (int)s["endDate"]["raw"]).Max();

                                    System.DateTime dateTime = DateTime.SpecifyKind(new System.DateTime(1970, 1, 1, 0, 0, 0, 0), DateTimeKind.Utc);

                                    YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Init);
                                    raw.Data = resp;
                                    raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                                    raw.Status = FinanceProcessEnum.Loaded;
                                    raw.LastFinance = dateTime.AddSeconds(max_timestamp);

                                }
                                catch (Exception ex)
                                {
                                    YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Init);
                                    raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                                }

                                context.SaveChanges();
                            }
                        }
                    }

                }*/

                if (ea.RoutingKey == "yahoo.process")
                {
                    var msg = JsonSerializer.Deserialize<Yahoo>(message);

                    if (msg != null)
                    {
                        using (var scope = _scopeFactory.CreateScope())
                        {
                            var context = scope.ServiceProvider.GetRequiredService<XContext>();

                            Func<DateTime, int> getFinYear = (endDate) =>
                            {
                                //финансовый год считаем завершенным до 15 января следующего года
                                return endDate.Month > 1 || endDate.Day > 15 ? endDate.Year : endDate.Year - 1;
                            };

                            foreach (string code in msg.Codes)
                            {
                                var raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == code && y.Status == FinanceProcessEnum.Loaded);

                                var security = context.SecuritySet
                                    .Include(s => s.SecurityStatistics)
                                    .Include(s => s.FinancialData)
                                    .Include(s => s.Emitent).ThenInclude(e => e.EmitentProfile).SingleOrDefault(x => x.FinancialPage == code);

                                JObject obj = JObject.Parse(raw.Data);

                                System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0);

                                IList<CommonLib.Objects.FinanceAnnual> _reports = obj["incomeStatementHistory"]["incomeStatementHistory"]
                                    .Select(s => new CommonLib.Objects.FinanceAnnual()
                                    {
                                        Id = Guid.NewGuid(),
                                        Code = security.Emitent.FinancialPage,
                                        CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                                        Data = "",
                                        Year = getFinYear(dateTime.AddSeconds((int)s["endDate"]["raw"]))
                                    })
                                    .OrderByDescending(r => r.Year)
                                    .ToList();

                                for (int i = 0; i < _reports.Count; i++)
                                {
                                    JObject report = new JObject();
                                    //report["financialsTemplate"] = obj["financialsTemplate"];
                                    report["incomeStatement"] = obj["incomeStatementHistory"]["incomeStatementHistory"][i];
                                    report["balanceSheet"] = obj["balanceSheetHistory"]["balanceSheetStatements"][i];
                                    report["cashflowStatement"] = obj["cashflowStatementHistory"]["cashflowStatements"][i];
                                    _reports[i].Data = report.ToString();
                                }


                                if (obj["assetProfile"] != null)
                                {
                                    if (security.Emitent.EmitentProfile == null)
                                    {
                                        security.Emitent.EmitentProfile = new EmitentProfile();
                                    }

                                    security.Emitent.EmitentProfile.Data = obj["assetProfile"].ToString();
                                    security.Emitent.EmitentProfile.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                                }

                                if (obj["financialData"] != null)
                                {
                                    if (security.FinancialData == null)
                                    {
                                        security.FinancialData = new FinancialData();
                                    }

                                    security.FinancialData.Data = obj["financialData"].ToString();
                                    security.FinancialData.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                                }

                                if (obj["defaultKeyStatistics"] != null)
                                {
                                    if (security.SecurityStatistics == null)
                                    {
                                        security.SecurityStatistics = new SecurityStatistics();
                                    }

                                    security.SecurityStatistics.Data = obj["defaultKeyStatistics"].ToString();
                                    security.SecurityStatistics.CreateDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                                }


                                foreach (var rep in _reports)
                                {
                                    var annual = context.FinanceAnnualSet.SingleOrDefault(f => f.Code == rep.Code && f.Year == rep.Year);

                                    //удалить старый отчет
                                    if (annual != null)
                                    {
                                        context.FinanceAnnualSet.Remove(annual);
                                    }

                                    context.FinanceAnnualSet.Add(rep);
                                }

                                raw.Status = FinanceProcessEnum.Processed;
                                context.SaveChanges();
                            }
                        }
                    }
                }

                if (ea.RoutingKey == "quote.update")
                {

                    var quote = JsonSerializer.Deserialize<Quote>(message);

                    if (quote != null)
                    {
                        using (var scope = _scopeFactory.CreateScope())
                        {
                            var context = scope.ServiceProvider.GetRequiredService<XContext>();

                            quote.lastUpdate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                            context.QuoteSet.Update(quote);
                            context.SaveChanges();
                        }
                    }
                }

                if (ea.RoutingKey == "yahoo.update")
                {
                    var received = JsonSerializer.Deserialize<YahooReceived>(message);

                    if (received != null)
                    {
                        using (var scope = _scopeFactory.CreateScope())
                        {
                            var context = scope.ServiceProvider.GetRequiredService<XContext>();

                            try
                            {
                                JObject obj = JObject.Parse(received.Response);

                                int max_timestamp = obj["incomeStatementHistory"]["incomeStatementHistory"].Select(s => (int)s["endDate"]["raw"]).Max();

                                System.DateTime dateTime = DateTime.SpecifyKind(new System.DateTime(1970, 1, 1, 0, 0, 0, 0), DateTimeKind.Utc);

                                YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == received.Code && y.Status == FinanceProcessEnum.Init);
                                raw.Data = received.Response;
                                raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                                raw.Status = FinanceProcessEnum.Loaded;
                                raw.LastFinance = dateTime.AddSeconds(max_timestamp);
                            }
                            catch(Exception ex)
                            {
                                YahooFinanceRaw raw = context.YahooFinanceRawSet.FirstOrDefault(y => y.Code == received.Code && y.Status == FinanceProcessEnum.Init);
                                raw.LoadDate = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

                            }

                            context.SaveChanges();
                        }
                    }
                }

                _channel.BasicAck(ea.DeliveryTag, false);

            };

            _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumerAsync);
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            DoStuff();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _channel.Dispose();
            return Task.CompletedTask;
        }
    }
}
