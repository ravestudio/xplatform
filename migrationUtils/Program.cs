
using CommonLib.Helpers;
using CommonLib.Model;
using Microsoft.Extensions.Configuration;
using migrationUtils.DataAccess;
using migrationUtils.Migrations;
using Newtonsoft.Json.Linq;
using System.Numerics;

namespace migrationUtils;

class Program
{
    static void Main(string[] args)
    {
        var environmentName = Environment.GetEnvironmentVariable("ENVIRONMENT") ?? "local";

        var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .AddJsonFile($"appsettings.{environmentName}.json", true)
                .AddEnvironmentVariables()
                .Build();

        var connectionString = configuration.GetConnectionString("xpl_db") ?? string.Empty;

        //processed
        /*var migration = new UpdateFinancialToVersion2(connectionString);

        migration.Execut();*/

        var migration = new AddChangeInWorkingCapital(connectionString);
        migration.Execut();

    }
}
