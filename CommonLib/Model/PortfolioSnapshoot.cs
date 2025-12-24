using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonLib.Model
{
    public class PortfolioSnapshoot
    {
        public PortfolioSnapshoot()
        {
            this.Accounts = new Dictionary<int, SnapshotAccount>();
        }
        public IDictionary<int, SnapshotAccount> Accounts { get; set; }

        public void increse(int account, string security, DateTime dealDate, int limit, decimal price)
        {
            if (!this.Accounts.ContainsKey(account))
            {
                this.Accounts[account] = new SnapshotAccount();
            }

            if (!this.Accounts[account].PositionItems.ContainsKey(security))
            {
                this.Accounts[account].PositionItems[security] = new Queue<PositionItem>();
            }

            while (this.Accounts[account].PositionItems[security].Count > 0 &&
                this.Accounts[account].PositionItems[security].Peek().Limit < 0 &&
                Math.Abs(this.Accounts[account].PositionItems[security].Peek().Limit) <= limit)//по модулю
            {
                var item = this.Accounts[account].PositionItems[security].Dequeue();
                limit += item.Limit;
            }

            if (this.Accounts[account].PositionItems[security].Count > 0 &&
                this.Accounts[account].PositionItems[security].Peek().Limit < 0 &&
                limit > 0)
            {
                var first = this.Accounts[account].PositionItems[security].Peek();
                first.Limit += limit;
                limit = 0;
            }

            if (limit > 0)
            {
                this.Accounts[account].PositionItems[security].Enqueue(new PositionItem()
                {
                    DealDate = dealDate,
                    Limit = limit,
                    Price = price
                });
            }

        }

        public void decrease(int account, string security, DateTime dealDate, int limit, decimal price)
        {
            if (!this.Accounts.ContainsKey(account))
            {
                this.Accounts[account] = new SnapshotAccount();
            }

            if (!this.Accounts[account].PositionItems.ContainsKey(security))
            {
                this.Accounts[account].PositionItems[security] = new Queue<PositionItem>();
            }

            while (this.Accounts[account].PositionItems[security].Count > 0 &&
                this.Accounts[account].PositionItems[security].Peek().Limit > 0 &&
                this.Accounts[account].PositionItems[security].Peek().Limit <= limit)
            {
                var item = this.Accounts[account].PositionItems[security].Dequeue();
                limit -= item.Limit;
            }

            if (this.Accounts[account].PositionItems[security].Count > 0 &&
                this.Accounts[account].PositionItems[security].Peek().Limit > 0 &&
                limit > 0)
            {
                var first = this.Accounts[account].PositionItems[security].Peek();
                first.Limit -= limit;
                limit = 0;
            }

            if (limit > 0)
            {
                this.Accounts[account].PositionItems[security].Enqueue(new PositionItem()
                {
                    DealDate = dealDate,
                    Limit = limit * (-1),
                    Price = price
                });
            }
        }

        private IEnumerable<IGrouping<int, PositionItem>> getGroups(IList<PositionItem> items)
        {

            for (int i = 0; i < items.Count - 1; i++)
            {
                var curr = items[i];
                var next = items[i + 1];

                if (curr.DealDate == next.DealDate && curr.Price == next.Price)
                {
                    next.v = curr.v;
                }

                if (curr.DealDate != next.DealDate || curr.Price != next.Price)
                {
                    next.v = curr.v + 1;
                }
            }

            return items.GroupBy(i => i.v);
        }

        public string toJson()
        {
            JObject snapObj = new JObject();

            JArray accountArr = new JArray();

            foreach (int accountId in this.Accounts.Keys)
            {
                JObject accountObj = JObject.FromObject(new
                {
                    accountId,
                    positions = this.Accounts[accountId].PositionItems.Keys
                    .SelectMany(sec =>
                         getGroups(this.Accounts[accountId].PositionItems[sec].ToList()), (sec, gr) =>
                            new {
                                security = sec,
                                date = gr.First().DealDate,
                                limit = gr.Sum(p => p.Limit),
                                price = gr.First().Price
                            })
                });

                accountArr.Add(accountObj);
            }
            snapObj["accounts"] = accountArr;

            return snapObj.ToString();
        }

        public void read(string json)
        {
            JObject snapObj = JObject.Parse(json);
            JArray accountArr = (JArray)snapObj["accounts"];

            foreach (var acc in accountArr.Select(a => new
            {
                accountId = (int)a["accountId"],
                account = new SnapshotAccount(a)
            }))
            {
                this.Accounts[acc.accountId] = acc.account;
            }
        }
    }

    public class SnapshotAccount
    {
        public SnapshotAccount(JToken accountObj)
        {
            this.PositionItems = new Dictionary<string, Queue<PositionItem>>(accountObj["positions"].Select(i => new
            {
                security = (string)i["security"],
                date = (DateTime)i["date"],
                limit = (int)i["limit"],
                price = (decimal)i["price"]
            }).GroupBy(p => p.security)
            .Select(g => new KeyValuePair<string, Queue<PositionItem>>(g.Key, new Queue<PositionItem>(g.Select(gi =>
            new PositionItem()
            {
                DealDate = gi.date,
                Limit = gi.limit,
                Price = gi.price
            }).OrderBy(p => p.DealDate)
            ))));
        }
        public SnapshotAccount()
        {
            this.PositionItems = new Dictionary<string, Queue<PositionItem>>();
        }
        public IDictionary<string, Queue<PositionItem>> PositionItems { get; set; }
    }
}
