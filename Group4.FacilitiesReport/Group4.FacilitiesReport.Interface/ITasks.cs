using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;


namespace Group4.FacilitiesReport.Interface
{
    public interface ITasks
    {
        public Task<List<DTO.Task>> GetTasks();
        public Task<List<DTO.Task>> GetTaskById(int Id);
        public Task<List<DTO.Task>> GetTaskByManagerId(string ManagerId);
        public Task<List<DTO.Task>> GetTaskByEmployeeId(string EmployeeId);
        public Task<List<DTO.Task>> GetTaskByFeedbackId(Guid FeebackId);
        public Task<APIResponse> CreateTask(DTO.Task task);
        public Task<APIResponse> UpdateTaskNote(int Id, string Note);
        public Task<APIResponse> UpdateTaskResponse(int Id, string response);
        public Task<APIResponse> UpdateTaskStatus(int Id, int Status);
        public Task<APIResponse> DeleteTask(int Id);

    }
}
