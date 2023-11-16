using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.Objects
{
    public class Deal
    {
        public int Id { get; set; }

        public int accountId { get; set; }
        public Account Account { get; set; }  
        public decimal Number { get; set; }

        public OrderOperationEnum Operation { get; set; }
        public DateTime Date { get; set; }
        public DateTime DeliveryDate { get; set; }
        public decimal Price { get; set; }
        public int Count { get; set; }
        public decimal Volume { get; set; }

        public decimal? NKD { get; set; }

        public int securityId { get; set; }
        public Security security { get; set; }
        public string Board { get; set; }

        public bool Locked { get; set; }
    }
}
