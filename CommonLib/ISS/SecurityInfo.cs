﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CommonLib.ISS
{
    public class SecurityInfo
    {
        public string BoardId { get; set; }
        public string Code { get; set; }

        public decimal PREVPRICE { get; set; }

        public decimal? NKD { get; set; }
    }
}
