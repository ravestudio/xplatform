using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xplatform.Model
{
    public class PortfolioSnapshoot
    {
        public PortfolioSnapshoot()
        {
            this.Accounts = new Dictionary<int, SnapshotAccount>();
        }
        public IDictionary<int, SnapshotAccount> Accounts { get; set; }

        private string GetCodeBoard(string security, string board)
        {
            return $"{board}\\{security}";
        }

        public void increse(int account, string security, string board, DateTime dealDate, int limit)
        {
            if (!this.Accounts.ContainsKey(account))
            {
                this.Accounts[account] = new SnapshotAccount();
            }

            if (!this.Accounts[account].PositionItems.ContainsKey(GetCodeBoard(security, board)))
            {
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)] = new Queue<PositionItem>();
            }

            while (this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Count > 0 &&
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek().Limit < 0 &&
                Math.Abs(this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek().Limit) <= limit)//по модулю
            {
                var item = this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Dequeue();
                limit += item.Limit;
            }

            if (this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Count > 0 &&
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek().Limit < 0 &&
                limit > 0)
            {
                var first = this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek();
                first.Limit += limit;
                limit = 0;
            }

            if (limit > 0)
            {
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Enqueue(new PositionItem()
                {
                    DealDate = dealDate,
                    Limit = limit
                });
            }

        }

        public void decrease(int account, string security, string board, DateTime dealDate, int limit)
        {
            if (!this.Accounts.ContainsKey(account))
            {
                this.Accounts[account] = new SnapshotAccount();
            }

            if (!this.Accounts[account].PositionItems.ContainsKey(GetCodeBoard(security, board)))
            {
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)] = new Queue<PositionItem>();
            }

            while(this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Count > 0 &&
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek().Limit > 0 &&
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek().Limit <= limit)
            {
                var item = this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Dequeue();
                limit -= item.Limit;
            }

            if (this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Count > 0 &&
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek().Limit > 0 &&
                limit > 0)
            {
                var first = this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Peek();
                first.Limit -= limit;
                limit = 0;
            }

            if (limit > 0)
            {
                this.Accounts[account].PositionItems[GetCodeBoard(security, board)].Enqueue(new PositionItem()
                {
                    DealDate = dealDate,
                    Limit = limit*(-1)
                });
            }
        }

        public string toJson()
        {
            JObject snapObj = new JObject();

            JArray accountArr = new JArray();

            foreach(int accountId in this.Accounts.Keys)
            {
                JObject accountObj = JObject.FromObject(new
                {
                    accountId,
                    positions = this.Accounts[accountId].PositionItems.Keys
                    .SelectMany(sec => this.Accounts[accountId].PositionItems[sec].GroupBy(i => i.DealDate), (sec, gr) =>
                        new {
                            security = sec,
                            date = gr.First().DealDate,
                            limit = gr.Sum(p => p.Limit)
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

            foreach(var acc in accountArr.Select(a => new
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
                limit = (int)i["limit"]
            }).GroupBy(p => p.security)
            .Select(g => new KeyValuePair<string, Queue<PositionItem>>(g.Key, new Queue<PositionItem>(g.Select(gi =>
            new PositionItem() {
                DealDate = gi.date,
                Limit = gi.limit
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
