using AutoMapper;
using Group4.FacilitiesReport.DTO;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;


namespace Group4.FacilitiesReport.Repositories
{
    public class TasksRepo : ITasks
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;
        private readonly IMapper _mapper;

        public TasksRepo(FacilitiesFeedbackManagement_SWP391Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public ICollection<TblTask> GetTasks()
        {
            if (_context.TblTasks.ToList() == null) throw new Exception();
            return _context.TblTasks.ToList();
        }

        public TblTask GetTaskById(int taskId)
        {
            return _context.TblTasks.Where(p => p.Id == taskId).FirstOrDefault();
        }

        public void InsertTask(TblTask task)
        {
            _context.TblTasks.Add(task);
            _context.SaveChanges();
        }

        public void UpdateTask(TblTask task)
        {
            _context.Update(task);
            _context.SaveChanges();
        }
    }
}
