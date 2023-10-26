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
        public Task<List<Category>> GetCategories();
        public Task<Category> GetCategoryById(string CategoryId);
        public Task<APIResponse> AddCate(Category category);
        public Task<APIResponse> UpdateCategory(Category category);
        public Task<APIResponse> DeleteCate(string CateId);


    }
}
