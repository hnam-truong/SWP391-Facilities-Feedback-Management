using Group4.FacilitiesReport.API.Helper;
using Group4.FacilitiesReport.DTO.Models;
using Group4.FacilitiesReport.Interface;
using Group4.FacilitiesReport.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Group4.FacilitiesReport.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddScoped<IUser, UserRepo>();
            builder.Services.AddScoped<ITasks, TaskRepo>();
            builder.Services.AddScoped<ILocation, LocationRepo>();
            builder.Services.AddScoped<ICate, CateRepo>();
            builder.Services.AddScoped<IFeedback, FeedbackRepo>();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddCors(p => p.AddDefaultPolicy(build =>
            {
                build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
            }));
            //builder.Services.AddRateLimiter(_ => _.AddFixedWindowLimiter(policyName: "fixed window", options =>
            //{
            //    options.Window = TimeSpan.FromSeconds(10);
            //    options.PermitLimit = 1;
            //    options.QueueLimit = 1;
            //    options.QueueProcessingOrder. = System.Threading.RateLimiting.QueueProcessingOrder.OrderFirst;
            //}));
            builder.Services.AddAuthentication("BasicAuthentication").AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<FacilitiesFeedbackManagement_SWP391Context>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });


            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors();

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}