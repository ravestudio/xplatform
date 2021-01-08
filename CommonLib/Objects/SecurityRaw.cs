using System;

namespace CommonLib.Objects
{
    public class SecurityRaw
    {
        public string isin { get; set; }
        public string figi { get; set; }
        public string ticker { get; set; }
        public decimal minPriceIncrement { get; set; }
        public int lot { get; set; }
        public string currency { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public bool Processed { get; set; }
        public string Board { get; set; }

        public string Emitent { get; set; }
    }
}