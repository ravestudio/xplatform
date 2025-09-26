using Newtonsoft.Json.Linq;

namespace xplatform.Model
{
    public class BalancingLog
    {
        public BalancingLog()
        {
            this.BalancingLogItems = new List<BalancingLogItem>();
        }
        public BalancingLog(Guid id, DateTime changeDate, JToken logObj, Func<int, BalancingLogItem> logItemCreator)
        {
            this.Id = id;
            this.ChangeDate = changeDate;
            this.BalancingLogItems = new List<BalancingLogItem>(logObj["logItems"]
                .Select(i => logItemCreator((int)i)));

            this.Structure = new List<StructureItem>(logObj["structure"]
                .Select(st => new StructureItem()
                {
                    portfolio = (string)st["portfolio"],
                    period = (string)st["period"],
                    shares = (decimal)st["shares"],
                    bond = (decimal)st["bond"],
                }));
        }

        public Guid Id { get; set; }

        public DateTime ChangeDate { get; set; }

        public IList<BalancingLogItem> BalancingLogItems { get; set; }
        public IList<StructureItem> Structure { get; set; }
    }


    public class BalancingLogItem
    {
        public int dealId { get; set; }
        public string code { get; set; }
        public decimal dealNumber { get; set; }
        public string operation { get; set; }
        public int count { get; set; }
        public decimal price { get; set; }
        public decimal cost { get; set; }

        public string account { get; set; }
    }

    public class StructureItem
    {
        public string portfolio { get; set; }
        public string period { get; set; }
        public decimal shares { get; set; }
        public decimal bond { get; set; }
    }
}
