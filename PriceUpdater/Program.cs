using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Text;
using System.Threading.Tasks;

namespace PriceUpdater
{
    class Program
    {
        public static async Task Main(string[] args)
        {

            var hostBuilder = new HostBuilder()
            // Add configuration, logging, ...
            .ConfigureServices((hostContext, services) =>
            {
                // Add your services with depedency injection.

                services.AddHostedService<PriceHostedService>();
            });

            await hostBuilder.RunConsoleAsync();

        }


    }
}
