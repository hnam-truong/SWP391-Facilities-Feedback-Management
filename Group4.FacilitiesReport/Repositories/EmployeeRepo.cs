
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;


namespace Repositories
{
    public class EmployeeRepo
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;

        public EmployeeRepo(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
        public bool ModifyCateId(List<Category> categories)
        {
            _context.Update(categories);
            return Save();
        }
    }
}
