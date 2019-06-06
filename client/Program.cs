using System;

namespace client
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("xplatform client");

            CommonLib.ISS.MicexISSClient micexISSClient = new CommonLib.ISS.MicexISSClient(new CommonLib.WebApiClient());

            micexISSClient.GetSecurityInfo("SBERP").ContinueWith(r =>
            {
                Console.WriteLine(r.Result.MarketData[0].LCURRENTPRICE);
            });

            Console.ReadKey();
        }
    }
}
