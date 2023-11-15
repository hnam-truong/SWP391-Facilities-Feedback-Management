using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.DTO
{
    public static class SystemConfig
    {
        public static DateTime ExpiredDate { get; set; }
        public static TimeSpan ExpiredTime { get; set; }
        public static int ExpiredHour { get; set; }
    }
}
