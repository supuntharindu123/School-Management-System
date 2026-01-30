using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IStudentRepo
    {
        public Task AddStudent(Student student);

        public Task<List<Student>> GetAllStudents();

        public Task<Student?> GetStudentById(int id);

        public Task DeleteStudent(Student student);

        public Task UpdateStudent();

        public Task<string> generateID();
    }
}
