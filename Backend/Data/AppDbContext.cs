using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<Teacher> Teachers { get; set; }

        public DbSet<Student> Students { get; set; }

        public DbSet<Grade> Grades { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        public DbSet<AcademicYear> AcademicYears { get; set; }

        public DbSet<Class> Classes { get; set; }

        public DbSet<ClassName> ClassNames { get; set; }

        public DbSet<StudentAcademicHistory> History0fStudents { get; set; }

        public DbSet<TeacherClassAssign> TeacherClassAssign { get; set; }

        public DbSet<StudentAttendances> StudentAttendances { get; set; }

        public DbSet<TeacherSubjectClass> TeacherSubjectClasses { get; set; }

        public DbSet<SubjectGrade> SubjectGrades {  get; set; }

        public DbSet<Marks> Marks { get; set; }

        public DbSet<Exam> Exams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.User)
                .WithOne(u=>u.Teacher)
                .HasForeignKey<Teacher>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne(u=>u.Student)
                .HasForeignKey<Student>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentAcademicHistory>()
                .HasOne(sh => sh.Student)
                .WithMany(s => s.AcademicHistory)
                .HasForeignKey(sh => sh.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StudentAcademicHistory>()
                .HasOne(sh=>sh.AcademicYear)
                .WithMany(y=>y.studentAcademicHistories)
                .HasForeignKey(sh => sh.AcademicYearId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasOne(sh=>sh.AcademicYear)
                .WithMany(y=>y.students)
                .HasForeignKey(sh => sh.AcademicYearId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Class>()
                .HasOne(g=>g.Grade)
                .WithMany(c=>c.Classes)
                .HasForeignKey(g=>g.GradeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Class>()
                .HasOne(g=>g.ClassName)
                .WithMany(c=>c.Classes)
                .HasForeignKey(g=>g.ClassNameID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Student>()
                .HasOne(s=>s.Class)
                .WithMany(c=>c.Students)
                .HasForeignKey(s=>s.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentAcademicHistory>()
                .HasOne(c=>c.Class)
                .WithMany(sh=>sh.StudentsHistory)
                .HasForeignKey(c=>c.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherClassAssign>()
                .HasOne(ta=>ta.Teacher)
                .WithMany(t=>t.AssignTasks)
                .HasForeignKey(ta=>ta.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherClassAssign>()
                .HasKey(tc=>tc.Id);

            modelBuilder.Entity<TeacherClassAssign>()
                .HasOne(tc => tc.Teacher)
                .WithMany(t => t.AssignTasks)
                .HasForeignKey(tc => tc.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherClassAssign>()
                .HasOne(tc => tc.Class)
                .WithMany(c => c.TeacherClassAssign)
                .HasForeignKey(tc => tc.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SubjectGrade>()
                .HasKey(sg => sg.Id);

            modelBuilder.Entity<SubjectGrade>()
                .HasOne(sg=>sg.Grade)
                .WithMany(g=>g.SubjectGrade)
                .HasForeignKey(sg=>sg.GradeID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SubjectGrade>()
                .HasOne(sg=>sg.Subject)
                .WithMany(s=>s.SubjectGrade)
                .HasForeignKey(sg=>sg.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherSubjectClass>()
                .HasKey (ts => ts.Id);

            modelBuilder.Entity<TeacherSubjectClass>()
                .HasOne(ts => ts.Subject)
                .WithMany(s=>s.TeacherSubjectClass)
                .HasForeignKey (ts=>ts.SubjectId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherSubjectClass>()
                .HasOne(ts => ts.Class)
                .WithMany(c=>c.TeacherSubjectClass)
                .HasForeignKey (ts=>ts.ClassId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<TeacherSubjectClass>()
                .HasOne(ts => ts.Teacher)
                .WithMany(t=>t.TeacherSubjectClass)
                .HasForeignKey (ts=>ts.TeacherId)
                .OnDelete (DeleteBehavior.Restrict);


            modelBuilder.Entity<StudentAttendances>()
                .HasOne(sa=>sa.Student)
                .WithMany(s=>s.StudentAttendances)
                .HasForeignKey(sa=>sa.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentAttendances>()
                .HasOne(sa=>sa.Teacher)
                .WithMany(t=>t.StudentAttendances)
                .HasForeignKey(sa=>sa.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Marks>()
                .HasOne(m=>m.Exam)
                .WithMany(e=>e.Marks)
                .HasForeignKey(m=>m.ExamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Marks>()
                .HasOne(m=>m.Student)
                .WithMany(s=>s.Marks)
                .HasForeignKey(m=>m.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Marks>()
                .HasOne(m=>m.TeacherSubjectClasses)
                .WithMany(ts=>ts.Marks)
                .HasForeignKey(m=>m.TeacherSubjectClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Exam>()
                .HasOne(e=>e.AcademicYear)
                .WithMany(a=>a.Exams)
                .HasForeignKey(e=>e.AcademicYearId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Exam>()
                .HasOne(e=>e.Grade)
                .WithMany(g=>g.Exams)
                .HasForeignKey(e=>e.GradeId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
