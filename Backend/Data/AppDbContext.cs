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
        public DbSet<AcademicYear> AcademicYears { get; set; }
        public DbSet<Class> Classes { get; set; }

        public DbSet<StudentAcademicHistory> History0fStudents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.user)
                .WithOne(u=>u.teacher)
                .HasForeignKey<Teacher>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasOne(t => t.Grade)
                .WithMany()
                .HasForeignKey(s => s.CurrentGradeID);

            modelBuilder.Entity<Student>()
                .HasOne(t => t.Class)
                .WithMany()
                .HasForeignKey(s => s.CurrentClassID);

            modelBuilder.Entity<Student>()
                .HasOne(t => t.AcademicYear)
                .WithMany()
                .HasForeignKey(s => s.CurrentYearID);

        }
    }
}
