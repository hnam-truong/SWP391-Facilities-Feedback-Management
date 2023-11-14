using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblConfig
    {
        public Guid Id { get; set; }
        public string? Variable { get; set; }
        public string? Value { get; set; }
    }
}
