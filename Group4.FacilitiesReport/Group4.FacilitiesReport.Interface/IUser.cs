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

        public Task<List<User>> GetUsersByStatus(int status);
        public Task<User> GetUserById(string userId);
        public Task<int> CountUsersByStatus(int status);
        public Task<List<User>> GetEmployeeByCate(string CateId);
        public Task<List<User>> GetUsersWhoProvidedFeedback();
        public Task<int> CountUsersWhoProvidedFeedback();
        public Task<List<User>> GetUsers();
        public Task<User> Login(string Email, string Password);
        public Task<APIResponse> UpdateStatusUser(string UserId, int Status);
        public Task<APIResponse> UpdateUser(User User);
        public Task<APIResponse> AddUser(User user);

    }
}
