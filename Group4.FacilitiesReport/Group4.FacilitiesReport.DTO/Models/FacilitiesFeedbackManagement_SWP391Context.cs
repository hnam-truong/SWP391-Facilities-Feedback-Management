using Microsoft.EntityFrameworkCore;

namespace Group4.FacilitiesReport.DTO.Models
{
    public partial class FacilitiesFeedbackManagement_SWP391Context : DbContext
    {
        public FacilitiesFeedbackManagement_SWP391Context()
        {
        }

        public FacilitiesFeedbackManagement_SWP391Context(DbContextOptions<FacilitiesFeedbackManagement_SWP391Context> options)
            : base(options)
        {
        }

        public virtual DbSet<TblCategoriesProblem> TblCategoriesProblems { get; set; } = null!;
        public virtual DbSet<TblFeedback> TblFeedbacks { get; set; } = null!;
        public virtual DbSet<TblLocation> TblLocations { get; set; } = null!;
        public virtual DbSet<TblTask> TblTasks { get; set; } = null!;
        public virtual DbSet<TblUser> TblUsers { get; set; } = null!;
        public virtual DbSet<TblUserRole> TblUserRoles { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {

                optionsBuilder.UseSqlServer("Server=DESKTOP-8KQM4AH; Database=FacilitiesFeedbackManagement_SWP391; Uid=sa; Pwd=12345");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TblCategoriesProblem>(entity =>
            {
                entity.ToTable("tbl_CategoriesProblem");

                entity.Property(e => e.Id)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Description).HasMaxLength(100);
            });

            modelBuilder.Entity<TblFeedback>(entity =>
            {
                entity.HasKey(e => e.FeedbackId)
                    .HasName("Feedback");

                entity.ToTable("tbl_Feedback");

                entity.Property(e => e.FeedbackId)
                    .HasColumnName("FeedbackID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.CateId)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("CateID")
                    .IsFixedLength();

                entity.Property(e => e.DateTime)
                    .HasColumnType("datetime")
                    .HasColumnName("Date_time")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description).HasMaxLength(300);

                entity.Property(e => e.ImgUrl)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("ImgURL");

                entity.Property(e => e.LocationId)
                    .HasMaxLength(15)
                    .HasColumnName("LocationID");

                entity.Property(e => e.Notify).HasDefaultValueSql("((0))");

                entity.Property(e => e.Response).HasMaxLength(100);

                entity.Property(e => e.Status).HasDefaultValueSql("((0))");

                entity.Property(e => e.Title).HasMaxLength(100);

                entity.Property(e => e.UserId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UserID");

                entity.Property(e => e.VideoUrl)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("VideoURL");

                entity.HasOne(d => d.Cate)
                    .WithMany(p => p.TblFeedbacks)
                    .HasForeignKey(d => d.CateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__tbl_Feedb__CateI__46E78A0C");

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.TblFeedbacks)
                    .HasForeignKey(d => d.LocationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__tbl_Feedb__Posit__47DBAE45");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.TblFeedbacks)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__tbl_Feedb__UserI__4222D4EF");
            });

            modelBuilder.Entity<TblLocation>(entity =>
            {
                entity.HasKey(e => e.LocationId)
                    .HasName("PK__tbl_Posi__70B8202851753999");

                entity.ToTable("tbl_Location");

                entity.Property(e => e.LocationId)
                    .HasMaxLength(15)
                    .HasColumnName("LocationID");

                entity.Property(e => e.Disable).HasColumnName("DISABLE");
            });

            modelBuilder.Entity<TblTask>(entity =>
            {
                entity.ToTable("tbl_Task");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.DateTime)
                    .HasColumnType("datetime")
                    .HasColumnName("Date_Time")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.EmployeeId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("EmployeeID");

                entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");

                entity.Property(e => e.ImgConfirmationUrl)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("ImgConfirmationURL");

                entity.Property(e => e.ManagerId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("ManagerID");

                entity.Property(e => e.Note).HasMaxLength(300);

                entity.Property(e => e.Responsed).HasMaxLength(300);

                entity.Property(e => e.Status).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.TblTaskEmployees)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__tbl_Task__Employ__5DCAEF64");

                entity.HasOne(d => d.Feedback)
                    .WithMany(p => p.TblTasks)
                    .HasForeignKey(d => d.FeedbackId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__tbl_Task__Feedba__5CD6CB2B");

                entity.HasOne(d => d.Manager)
                    .WithMany(p => p.TblTaskManagers)
                    .HasForeignKey(d => d.ManagerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__tbl_Task__Manage__5EBF139D");
            });

            modelBuilder.Entity<TblUser>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("Users");

                entity.ToTable("tbl_Users");

                entity.HasIndex(e => e.UserId, "UQ__tbl_User__1788CCAD174AB4A3")
                    .IsUnique();

                entity.HasIndex(e => e.Email, "UQ__tbl_User__A9D1053497C877FD")
                    .IsUnique();

                entity.Property(e => e.UserId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UserID")
                    .HasDefaultValueSql("(CONVERT([varchar](36),newid()))");

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.Password)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.RoleId).HasColumnName("RoleID");

                entity.Property(e => e.Status).HasDefaultValueSql("((0))");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.TblUsers)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_tblUser_RoleID");

                entity.HasMany(d => d.Cates)
                    .WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "TblSpecialist",
                        l => l.HasOne<TblCategoriesProblem>().WithMany().HasForeignKey("CateId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__tbl_Speci__CateI__534D60F1"),
                        r => r.HasOne<TblUser>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK__tbl_Speci__UserI__52593CB8"),
                        j =>
                        {
                            j.HasKey("UserId", "CateId").HasName("Specialist_PrimaryKey");

                            j.ToTable("tbl_Specialist");

                            j.IndexerProperty<string>("UserId").HasMaxLength(36).IsUnicode(false).HasColumnName("UserID");

                            j.IndexerProperty<string>("CateId").HasMaxLength(3).IsUnicode(false).HasColumnName("CateID").IsFixedLength();
                        });
            });

            modelBuilder.Entity<TblUserRole>(entity =>
            {
                entity.HasKey(e => e.RoleId)
                    .HasName("PK__tbl_User__8AFACE3A11CCB16F");

                entity.ToTable("tbl_UserRole");

                entity.Property(e => e.RoleId)
                    .ValueGeneratedNever()
                    .HasColumnName("RoleID");

                entity.Property(e => e.Description)
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
