using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Messaging;
using XCub.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace XCub
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

            var hostBuilder = new HostBuilder()
            // Add configuration, logging, ...
            .ConfigureServices((hostContext, services) =>
            {

                string env = hostContext.HostingEnvironment.EnvironmentName;

                var connectionString = configuration.GetConnectionString("xpl_db");

                services.AddDbContext<XContext>(options =>
                {
                    options.UseNpgsql(connectionString);
                });

                services.SetUpRabbitMq(configuration);
                // Add your services with depedency injection.
                services.AddHostedService<RabbitReceiver>();

                /*services.AddSingleton<RabbitSender>();
                services.AddHostedService<PriceHostedService>();
                services.AddHostedService<FinanceHostedService>();*/
            });

            await hostBuilder.RunConsoleAsync();
        }
    }
}