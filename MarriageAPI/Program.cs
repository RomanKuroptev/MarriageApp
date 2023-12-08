// Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var key = builder.Configuration["Jwt:Key"];
        var issuer = builder.Configuration["Jwt:Issuer"];
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value))
                };
            });
        // Add DbContext
        builder.Services.AddDbContext<WeddingContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddEndpointsApiExplorer();

        // Register the Swagger generator
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
            });
        });

        // Add CORS services
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .WithExposedHeaders("Access-Control-Allow-Origin");
                });
        });
        builder.Services.AddAuthorization();
        var app = builder.Build();
        // Apply migrations
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<WeddingContext>();
            dbContext.Database.EnsureCreated();
            dbContext.Database.Migrate();
        }
        // Enable middleware to serve generated Swagger as a JSON endpoint
        app.UseSwagger();

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint
        var swaggerRouteTemplate = builder.Configuration.GetSection("Swagger:RouteTemplate").Value;

        // ...

        app.UseSwagger(c =>
        {
            c.RouteTemplate = swaggerRouteTemplate;
        });

        var swaggerEndpoint = builder.Configuration.GetSection("Swagger:Endpoint").Value;
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint(swaggerEndpoint, "My API V1");
        });

        // Use CORS policy
        app.UseCors("AllowAllOrigins");

        WeddingApiEndpoints.MapGuestsEndpoint(app);
        WeddingApiEndpoints.MapLoginEndpoint(app);
        // Configure the HTTP request pipeline.
        app.UseAuthentication();
        app.UseAuthorization();
        SeedDatabase(app);
        app.Run();
    }
    private static void SeedDatabase(IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<WeddingContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var adminEmail = configuration["AuthorizedEmail"];

            if (!context.Guests.Any())
            {
                context.Guests.Add(new Guest
                {
                    Id = 1,
                    Name = "Admin",
                    Email = adminEmail,
                    RSVPCode = Guid.NewGuid().ToString(),
                    // other properties...
                });
                context.SaveChanges();
            }
        }
    }
}
