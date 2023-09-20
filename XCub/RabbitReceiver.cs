using CommonLib.Objects;
using Messaging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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

            var consumer = new EventingBasicConsumer(_channel);

            consumer.Received += (_, ea) =>
            {

                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
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

                _channel.BasicAck(ea.DeliveryTag, false);

            };

            _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);
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
