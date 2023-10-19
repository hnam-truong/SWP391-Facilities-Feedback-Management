using Group4.FacilitiesReport.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    public interface ICate  
    {
        Task<List<Category>> GetCategories();
        Task<Category> GetCategoryById(string CategoryId);
        Task<APIResponse> UpdateCategory(Category category);
        Task<APIResponse> AddCate(Category category);

    }
}
