﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;

namespace Messaging
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection SetUpRabbitMq(this IServiceCollection services, IConfiguration config)
        {
            var configSection = config.GetSection("RabbitMQSettings");
            var settings = new RabbitMQSettings();
            configSection.Bind(settings);
            // add the settings for later use by other classes via injection
            services.AddSingleton<RabbitMQSettings>(settings);

            // As the connection factory is disposable, need to ensure container disposes of it when finished
            services.AddSingleton<IConnectionFactory>(sp => new ConnectionFactory
            {
                HostName = settings.HostName,
                //DispatchConsumersAsync = true,
            });

            services.AddSingleton<ModelFactory>();
            services.AddSingleton(sp => sp.GetRequiredService<ModelFactory>().CreateChannel());

            return services;
        }

        public class ModelFactory : IDisposable
        {
            private readonly IConnection _connection;
            private readonly RabbitMQSettings _settings;
            public ModelFactory(IConnectionFactory connectionFactory, RabbitMQSettings settings)
            {
                _settings = settings;
                _connection = connectionFactory.CreateConnection();
            }

            public IModel CreateChannel()
            {
                var channel = _connection.CreateModel();
                channel.ExchangeDeclare(exchange: _settings.ExchangeName, type: _settings.ExchangeType);
                return channel;
            }

            public void Dispose()
            {
                _connection.Dispose();
            }
        }
    }
}
