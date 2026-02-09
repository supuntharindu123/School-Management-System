using Backend.DTOs.Teacher;
using Backend.DTOs.User;

public class TeacherResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? FullName { get; set; }
    public DateOnly BirthDay { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Gender { get; set; }

    public UserDto? User { get; set; }
    public List<TeacherClassAssignResDto>? ClassAssignments { get; set; }
    public List<TeacherSubjectClassResDto>? SubjectClasses { get; set; }
}
