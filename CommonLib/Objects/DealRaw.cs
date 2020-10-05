using System;

namespace CommonLib.Objects
{
    public class DealRaw
    {
        public decimal number { get; set; }
        public string board { get; set; }
        public string symbol { get; set; }
        public string operation { get; set; }
        public string date { get; set; }
        public string time { get; set; }
        public string delivery_date { get; set; }
        public decimal price { get; set; }
        public int count { get; set; }
        public decimal volume { get; set; }
        public decimal? nkd { get; set; }
        public string client { get; set; }
    }
}