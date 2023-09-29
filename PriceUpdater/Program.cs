using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Messaging;

namespace PriceUpdater
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            var environmentName = Environment.GetEnvironmentVariable("ENVIRONMENT");

            // build config
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .AddJsonFile($"appsettings.{environmentName}.json", true)
                .AddEnvironmentVariables()
                .Build();

            string logPath = configuration.GetSection("logPath").Value;
            string logFile = Path.Combine(logPath, "updater.txt");

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.File(logFile, rollingInterval: RollingInterval.Day)
                .CreateLogger();

            Log.Information("Starting host");

            var hostBuilder = new HostBuilder()
            // Add configuration, logging, ...
            .ConfigureServices((hostContext, services) =>
            {
                string env = hostContext.HostingEnvironment.EnvironmentName;
                services.AddSingleton<ILogger>(provider => { return Log.Logger; });

                services.SetUpRabbitMq(configuration);
                // Add your services with depedency injection.
                services.AddHostedService<RabbitReceiver>();
                services.AddSingleton<RabbitSender>();
                //services.AddHostedService<PriceHostedService>();
                services.AddHostedService<FinanceHostedService>();
            }).UseSerilog();

            await hostBuilder.RunConsoleAsync();

        }


    }
}
