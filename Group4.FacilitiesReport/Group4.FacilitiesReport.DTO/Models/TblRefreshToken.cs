using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class TblRefreshToken
    {
        public string UserId { get; set; } = null!;
        public string? TokenId { get; set; }
        public string? RefreshToken { get; set; }
    }
}
