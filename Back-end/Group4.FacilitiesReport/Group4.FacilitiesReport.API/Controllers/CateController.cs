using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CateController : ControllerBase
    {
        private readonly ICate _iCategory;

        public CateController(ICate iCategory)
        {
            _iCategory = iCategory;
        }

        [HttpGet("GetAllCate")]
        public async Task<IActionResult> GetCates()
        {
            var data = await _iCategory.GetCategories();
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }
        //[Authorize("Manager")]
        [HttpGet("{CateId}")]
        public async Task<IActionResult> GetCateByCateId(string CateId)
        {
            var category = await _iCategory.GetCategoryById(CateId);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
        //[Authorize("Manager")]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateCate(string Id, string Des)
        {
            var cate = await _iCategory.AddCate(new Category
            {
                Id = Id,
                Description = Des
            });
            return Ok(cate);
        }
        //[Authorize("Manager")]
        [HttpPut("UpdateCate")]
        public async Task<IActionResult> UpdateCate(string CateId, string Des)
        {
            var cate = await _iCategory.UpdateCategory(new Category
            {
                Id = CateId,
                Description = Des
            });
            return Ok(cate);
        }
        //[Authorize("Manager")]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(string CateId)
        {
            return Ok(await _iCategory.DeleteCate(CateId));
        }
    }
}
