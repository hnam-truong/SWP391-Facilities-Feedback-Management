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

        Task<List<User>> GetUsersByStatus(int status);
        Task<User> GetUserById(string userId);
        Task<int> CountUsersByStatus(int status);
        Task<List<User>> GetUsersByRole(int role);
        Task<List<User>> GetUsersWhoProvidedFeedback();
        Task<int> CountUsersWhoProvidedFeedback();
        Task<List<User>> GetUsers();

        Task<APIResponse> UpdateStatusUser(string UserId, int Status);
        Task<APIResponse> UpdateUser(User User);
    }
}
