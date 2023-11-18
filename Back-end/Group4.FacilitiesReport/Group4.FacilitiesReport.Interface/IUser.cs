using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Group4.FacilitiesReport.Interface
{
    public interface IUser
    {
        public Task<List<User>> GetEmployeeByCate(string CateId);
        public Task<List<User>> GetUsersWhoProvidedFeedback();
        public Task<List<User>> GetUsers();
        public Task<User> GetUserById(string userId);
        public Task<int> CountUsersActive();
        public Task<int> CountUsersBanned();
        public Task<int> CountUsersWhoProvidedFeedback();
        public Task<int> CountUsersWhoProvidedFeedbackToday();
        public Task<List<EmployeeObject>> CountEmployeeTask(string CateId);
        public Task<User?> Login(string Email, string Password);
        public Task<APIResponse> UpdateStatus(string UserId, int Status);
        public Task<APIResponse> UpdateUser(User User);
        public Task<APIResponse> AddUser(User user);
        public Task<APIResponse> AddCateByUserId(string UserId, string CateId);
    }
}
