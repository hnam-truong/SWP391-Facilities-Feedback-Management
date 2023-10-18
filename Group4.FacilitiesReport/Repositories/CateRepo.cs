using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Repositories
{
    public class CateRepo : ICategory
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;

        public CateRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public bool AddCate(List<Category> categories)
        {
            _context.Add(categories);
            return Save();
        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
