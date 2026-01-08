using Travel.Genie.Services;
using Travel.Genie.Services.Interfaces;
using Travel.Genie.Repositories.Interfaces;
using Travel.Genie.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Travel.Genie.Data;
using Microsoft.AspNetCore.SpaServices.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IOtpService, OtpService>();
builder.Services.AddSingleton<IUserService, UserService>();
builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<ITripService, TripService>();
builder.Services.AddScoped<IAiTripPlannerService, AiTripPlannerService>();

var jwtConfig = builder.Configuration.GetSection("Jwt");
var secret = jwtConfig["Secret"];
var loggerFactory = LoggerFactory.Create(logging => logging.AddConsole());
var logger = loggerFactory.CreateLogger("Program");

if (!string.IsNullOrEmpty(secret))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    if (context.Request.Cookies.TryGetValue("auth_token", out var authToken))
                    {
                        context.Token = authToken;
                    }
                    return Task.CompletedTask;
                }
            };
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtConfig["Issuer"],
                ValidAudience = jwtConfig["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
            };
        });
}
else
{
    if (builder.Environment.IsDevelopment())
    {
        builder.Logging.AddConsole();
        logger.LogWarning("JWT Secret not configured. Authentication disabled for development.");
    }
    else
    {
        logger.LogError("JWT Secret not configured. This is not allowed outside Development. Shutting down.");
        throw new InvalidOperationException("JWT Secret not configured. Application cannot start in non-development environments without a JWT secret.");
    }
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// ✅ Make sure API endpoints are registered before SPA middleware
app.MapControllers();
var controllerAssembly = typeof(Travel.Genie.Controllers.AuthController).Assembly.FullName;
Console.WriteLine($"Loaded controllers from: {controllerAssembly}");


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), spaApp =>
        {
            spaApp.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
            });
        });
}
else
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), spaApp =>
    {
        spaApp.UseSpaStaticFiles();
        spaApp.Run(async context =>
        {
            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath!, "index.html"));
        });
    });

    app.MapFallbackToFile("/index.html");
}

await app.RunAsync();
