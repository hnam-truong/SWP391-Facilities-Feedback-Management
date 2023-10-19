using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;


namespace Group4.FacilitiesReport.Interface
{
    public interface ITasks
    {
        Task<List<DTO.Task>> GetTasks();
        Task<List<DTO.Task>> GetTaskById(int Id);
        Task<List<DTO.Task>> GetTaskByManagerId(string ManagerId);
        Task<List<DTO.Task>> GetTaskByEmployeeId(string EmployeeId);
        Task<List<DTO.Task>> GetTaskByFeedbackId(Guid FeebackId);
        Task<APIResponse> CreateTask(DTO.Task task);
        Task<APIResponse> UpdateTask(DTO.Task task);
        Task<APIResponse> UpdateTaskNote(int Id, string Note);
        Task<APIResponse> UpdateTaskResponse(int Id, string response);
        Task<APIResponse> UpdateTaskStatus(int Id, int Status);
        Task<APIResponse> DeleteTask(int Id);

    }
}
