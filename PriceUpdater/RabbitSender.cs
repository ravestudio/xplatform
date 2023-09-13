using Messaging;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PriceUpdater
{
    public class RabbitSender
    {
        private readonly IModel _channel;

        private readonly RabbitMQSettings _rabbitSettings;

        public RabbitSender(RabbitMQSettings rabbitSettings, IModel channel)
        {
            _channel = channel;
            _rabbitSettings = rabbitSettings;
        }

        public void PublishMessage<T>(T entity, string key) where T : class
        {
            var message = JsonSerializer.Serialize(entity);

            var body = Encoding.UTF8.GetBytes(message);

            _channel.BasicPublish(exchange: _rabbitSettings.ExchangeName,
                                                routingKey: key,
                                                basicProperties: null,
                                                body: body);

            Console.WriteLine(" [x] Sent '{0}':'{1}'", key, message);

        }
    }
}
