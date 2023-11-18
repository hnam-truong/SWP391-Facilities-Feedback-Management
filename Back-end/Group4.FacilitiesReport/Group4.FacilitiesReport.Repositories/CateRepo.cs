using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Group4.FacilitiesReport.Repositories
{
    public class CateRepo : ICate
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;
        private readonly ILogger<CateRepo> _logger;

        public CateRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper, ILogger<CateRepo> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        private IQueryable<TblCategoriesProblem> AllCate() => _context.TblCategoriesProblems;


        public async Task<List<Category>> GetCategories()
        {
            _logger.LogInformation("Begin Get Categories");
            List<Category> _response = new List<Category>();
            var _data = await _context.TblCategoriesProblems.ToListAsync();
            if (_data != null)
            {
                _response = _mapper.Map<List<TblCategoriesProblem>, List<Category>>(_data);
            }
            return _response;
        }

        public async Task<Category> GetCategoryById(string CategoryId)
        {

            _logger.LogInformation("Begin Get Category by ID");
            Category _response = new Category();
            var _data = await AllCate().Where(f => f.Id.ToLower().Equals(CategoryId.ToLower())).FirstOrDefaultAsync();
            if (_data != null)
            {
                _response = _mapper.Map<TblCategoriesProblem, Category>(_data);
            }
            return _response;
        }

        public async Task<APIResponse> AddCate(Category category)
        {
            _logger.LogInformation("Begin Add Category");
            APIResponse _response = new APIResponse();
            try
            {
                TblCategoriesProblem _cate = _mapper.Map<Category, TblCategoriesProblem>(category);
                await _context.TblCategoriesProblems.AddAsync(_cate);
                await this._context.SaveChangesAsync(); 
                _response.ResponseCode = 200;
                _response.Result = _cate.Id;

            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.ErrorMessage = ex.Message;
            }
            return _response;
        }
        public async Task<APIResponse> UpdateCategory(Category category)
        {
            _logger.LogInformation("Begin Update Category");
            APIResponse response = new APIResponse();
            try
            {
                var _cate = await _context.TblCategoriesProblems.FindAsync(category.Id);
                if (_cate != null)
                {
                    _cate.Id = category.Id;
                    _cate.Description = category.Description;
                    await _context.SaveChangesAsync();
                    response.ResponseCode = 200;
                    response.Result = _cate.Id.ToString();
                }
                else
                {
                    response.ResponseCode = 404;
                    response.ErrorMessage = "Data not found";
                }

            }
            catch (Exception ex)
            {
                response.ResponseCode = 400;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<APIResponse> DeleteCate(string CateId)
        {
            _logger.LogInformation("Begin Delete Category");
            APIResponse _response = new APIResponse();
            try
            {
                TblCategoriesProblem? cate = await _context.TblCategoriesProblems.FindAsync(CateId);
                if (cate != null)
                {
                    _context.TblCategoriesProblems.Remove(cate);
                    var list = _context.TblUsers.Include(u => u.Role).Include(u => u.Cates.Where(c => c.Id == CateId)).Where(u => u.Role.Description == "Employee");
                    foreach (var c in list)
                        c.Cates.Remove(cate);
                    await _context.SaveChangesAsync();
                    _response.ResponseCode = 200;
                    _response.Result = CateId;
                }
                else
                {
                    _response.ResponseCode = 400;
                    _response.Result = "Data not found!";

                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = 400;
                _response.Result = ex.Message;

            }
            return _response;
        }


    }
}
