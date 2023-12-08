using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using MarriageAPI.Dto;
using MarriageAPI.dto;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

public static class WeddingApiEndpoints
{
    public static void MapLoginEndpoint(IEndpointRouteBuilder endpoints)
    {

    }
    public record LoginRequest(string Email);
    public static void MapGuestsEndpoint(IEndpointRouteBuilder endpoints)
    {

        endpoints.MapPost("/login", async ([FromBody] LoginRequest loginRequest, HttpContext context) =>
        {
            try
            {
                var db = context.RequestServices.GetRequiredService<WeddingContext>();
                var email = loginRequest.Email;

                var guest = await db.Guests.FirstOrDefaultAsync(g => g.Email == email);
                if (guest == null)
                {
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await context.Response.WriteAsync("Invalid email");
                    return;
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, guest.Email),
                };

                var configuration = context.RequestServices.GetRequiredService<IConfiguration>();
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expiry = DateTime.Now.AddDays(5);

                var token = new JwtSecurityToken(
                        issuer: configuration["Jwt:Issuer"],
                        audience: configuration["Jwt:Issuer"],
                        claims: claims,
                        expires: expiry,
                        signingCredentials: creds
                    );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                var response = new
                {
                    token = tokenString,
                    expiration = expiry
                };

                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);

                // Set the status code to 500 (Internal Server Error)
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("An error occurred while processing the request.");
            }
        });

        endpoints.MapGet("/guests", async (HttpContext context, WeddingContext dbContext) =>
        {
            if (!await IsAuthorizedGuest(context))
            {
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }

            List<Guest> guests = await dbContext.Guests.ToListAsync();
            return Results.Json(guests);
        }).Produces<List<Guest>>()
        .RequireAuthorization();

        // add crud endpoints for guests
        endpoints.MapGet("/guests/{id}", async (WeddingContext dbContext, int id) =>
        {
            var guest = await dbContext.Guests.FindAsync(id);
            if (guest == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(guest);
        }).Produces<Guest>()
        .RequireAuthorization();

        endpoints.MapGet("/guests/rsvp/{rsvpCode}", async (WeddingContext dbContext, string rsvpCode) =>
        {
            var guest = await dbContext.Guests.FirstOrDefaultAsync(g => g.RSVPCode == rsvpCode);

            if (guest == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(guest);
        }).Produces<Guest>();

        endpoints.MapGet("/guests/email/{email}", async (WeddingContext dbContext, string email) =>
        {
            var guest = await dbContext.Guests.FirstOrDefaultAsync(g => g.Email == email);

            if (guest == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(guest);
        }).Produces<Guest>()
        .RequireAuthorization();

        // add update endpoint
        endpoints.MapPut("/guests/{id}", async (WeddingContext dbContext, int id, UpdateGuestDto guestDto) =>
        {
            if (!GuestExists(dbContext, id))
            {
                return Results.NotFound("A guest with this ID does not exist.");
            }

            var updatedGuest = GuestMapper.MapToGuestEntity(guestDto);
            updatedGuest.Id = id; // Ensure the ID is set correctly

            dbContext.Entry(updatedGuest).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuestExists(dbContext, id))
                {
                    return Results.NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Results.NoContent();
        });

        //add delete endpoint
        endpoints.MapDelete("/guests/{id}", async (HttpContext context, WeddingContext dbContext, int id) =>
        {
            if (!await IsAuthorizedGuest(context))
            {
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }
            var guest = await dbContext.Guests.FindAsync(id);
            if (guest == null)
            {
                return Results.NotFound();
            }

            dbContext.Guests.Remove(guest);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        })
        .RequireAuthorization();

        // change the post method below to use guestexsists method
        endpoints.MapPost("/guests", async (HttpContext context, WeddingContext dbContext, CreateGuestDto guestDto) =>
        {
            if (!await IsAuthorizedGuest(context))
            {
                return Results.StatusCode(StatusCodes.Status403Forbidden);
            }
            var guest = GuestMapper.MapToGuestEntity(guestDto);
            dbContext.Guests.Add(guest);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/guests/{guest.Id}", guest);
        })
        .RequireAuthorization();

    }
    private static async Task<bool> IsAuthorizedGuest(HttpContext context)
    {
        var emailClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
        var configuration = context.RequestServices.GetRequiredService<IConfiguration>();
        var authorizedEmail = configuration.GetValue<string>("AuthorizedEmail");


        if (authorizedEmail != emailClaim!.Value)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsync("Forbidden");
            return false;
        }

        return true;
    }
    private static bool GuestExists(WeddingContext dbContext, int id)
    {
        return dbContext.Guests.Any(e => e.Id == id);
    }
}