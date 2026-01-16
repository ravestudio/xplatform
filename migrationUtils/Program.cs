
using CommonLib.Helpers;
using CommonLib.Model;
using CommonLib.Objects;
using Microsoft.Extensions.Configuration;
using migrationUtils.DataAccess;
using migrationUtils.Migrations;
using Newtonsoft.Json.Linq;
using System.Numerics;
using System.Reactive.Disposables;
using System.Reactive.Linq;

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

        /*var migration = new AddChangeInWorkingCapital(connectionString);
        migration.Execut();*/

        var loadTinkoffDeals = new LoadTinkoffDeals(connectionString);
        loadTinkoffDeals.Execut("2031387521", "2017-01-01", "2025-12-31");

        IList<string> values = new List<string>() { "Hello", "Hello2", "world" };

        var observables = values.Select(v => Observable.Create<string>(observer =>
        {

            observer.OnNext(v);
            observer.OnCompleted();
            return Disposable.Empty;

        }).Delay(TimeSpan.FromSeconds(5)));

        // Define two source observables
        /*var observable1 = Observable.Create<string>(observer => {

            observer.OnNext("Hello");
            observer.OnCompleted();
            return Disposable.Empty;

        }).Delay(TimeSpan.FromSeconds(5));
        var observable2 = Observable.Create<string>(observer => {

            observer.OnNext("Hello2");
            observer.OnCompleted();
            return Disposable.Empty;

        }).Delay(TimeSpan.FromSeconds(5));
        var observable3 = Observable.Create<string>(observer => {

            observer.OnNext("world");
            observer.OnCompleted();
            return Disposable.Empty;

        }).Delay(TimeSpan.FromSeconds(5));*/

        //var finish = Observable.Return("finish").Do(v => Console.WriteLine("finish"));

        // Concatenate them
        var concatenated = observables.Concat().Concat(Observable.Create<string>(observer => {

            Console.WriteLine("finish");

            observer.OnNext("process");
            observer.OnCompleted();
            return Disposable.Empty;

        }))
            /*.Do(v => {
            if (v != "")
            {
                Console.WriteLine("do {0}", v);
            }
        })*/
//.Delay(TimeSpan.FromSeconds(10))
.Repeat();

        //.Do(v => Console.WriteLine("qqq"));

        // Subscribe and observe the output
        concatenated.Subscribe(
            value => Console.WriteLine($"next {value}"),
            ex => Console.WriteLine($"Error: {ex.Message}"),
            () => Console.WriteLine("Completed")
        );


        Console.ReadKey();

    }
}
