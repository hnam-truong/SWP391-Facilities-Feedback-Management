using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;


namespace Group4.FacilitiesReport.Interface
{
    public interface ITasks
    {
        public Task<List<DTO.Task>> GetTasks();
        public Task<DTO.Task> GetTaskById(Guid Id);
        public Task<List<DTO.Task>> GetTaskByManagerId(string ManagerId);
        public Task<List<DTO.Task>> GetTaskByEmployeeId(string EmployeeId);
        public Task<List<DTO.Task>> GetTaskByFeedbackId(Guid FeebackId);
        public Task<int> CountTaskClosed();
        public Task<int> CountTaskClosedToday();
        public Task<int> CountTaskDelivered();
        public Task<int> CountTaskDeliveredToday();
        public Task<APIResponse> CreateTask(DTO.Task task);
        public Task<APIResponse> UpdateTaskNote(Guid Id, string Note);
        public Task<APIResponse> UpdateTaskResponse(Guid Id, string response);
        public Task<APIResponse> UpdateTaskStatus(Guid Id, int status);
        public Task<APIResponse> DeleteTask(Guid Id);

    }
}
