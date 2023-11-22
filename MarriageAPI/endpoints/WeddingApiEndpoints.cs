using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using MarriageAPI.Dto;
using MarriageAPI.dto;

public static class WeddingApiEndpoints
{
    public static void MapGuestsEndpoint(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/guests", async (WeddingContext dbContext) =>
        {
            List<Guest> guests = await dbContext.Guests.ToListAsync();
            return Results.Ok(guests);
        }).Produces<List<Guest>>();

        // add crud endpoints for guests
        endpoints.MapGet("/guests/{id}", async (WeddingContext dbContext, int id) =>
        {
            var guest = await dbContext.Guests.FindAsync(id);
            if (guest == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(guest);
        }).Produces<Guest>();

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
        }).Produces<Guest>();

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
        endpoints.MapDelete("/guests/{id}", async (WeddingContext dbContext, int id) =>
        {
            var guest = await dbContext.Guests.FindAsync(id);
            if (guest == null)
            {
                return Results.NotFound();
            }

            dbContext.Guests.Remove(guest);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        // change the post method below to use guestexsists method
        endpoints.MapPost("/guests", async (WeddingContext dbContext, CreateGuestDto guestDto) =>
        {
            var guest = GuestMapper.MapToGuestEntity(guestDto);
            dbContext.Guests.Add(guest);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/guests/{guest.Id}", guest);
        });
    
    }

    private static bool GuestExists(WeddingContext dbContext, int id)
    {
        return dbContext.Guests.Any(e => e.Id == id);
    }
}