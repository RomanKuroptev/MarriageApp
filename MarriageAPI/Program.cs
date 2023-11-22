// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
// Add DbContext
builder.Services.AddDbContext<WeddingContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();

// Register the Swagger generator
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
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
app.Run();