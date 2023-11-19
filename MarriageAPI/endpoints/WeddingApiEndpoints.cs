using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using MarriageAPI.Dto;

public static class WeddingApiEndpoints
{
    public static void MapWeddingEndpoint(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/wedding", async (WeddingContext dbContext) =>
        {
            var wedding = await dbContext.Weddings.FirstOrDefaultAsync();
            if (wedding == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(wedding);
        });
    }

    public static void MapGuestsEndpoint(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/guests", async (WeddingContext dbContext) =>
        {
            var guests = await dbContext.Guests.ToListAsync();
            return Results.Ok(guests);
        });

        // add crud endpoints for guests
        endpoints.MapGet("/guests/{id}", async (WeddingContext dbContext, int id) =>
        {
            var guest = await dbContext.Guests.FindAsync(id);
            if (guest == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(guest);
        });

        endpoints.MapGet("/guests/rsvp/{rsvpCode}", async (WeddingContext dbContext, string rsvpCode) =>
        {
            var guest = await dbContext.Guests.FirstOrDefaultAsync(g => g.RSVPCode == rsvpCode);

            if (guest == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(guest);
        });

        // add update endpoint
        endpoints.MapPut("/guests/{id}", async (WeddingContext dbContext, int id, GuestDto guest) =>
        {
            if (id != guest.Id)
            {
                return Results.BadRequest();
            }

            dbContext.Entry(guest).State = EntityState.Modified;

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
        endpoints.MapPost("/guests", async (WeddingContext dbContext, GuestDto guestDto) =>
        {
            if (GuestExists(dbContext, guestDto.Id))
            {
                return Results.Conflict("A guest with this ID already exists.");
            }
            var guest = GuestMapper.MapToGuestEntity(guestDto);
            dbContext.Guests.Add(guest);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/guests/{guest.Id}", guest);
        });
    
    }
    // Add the following method: create a new wedding
    public static void MapCreateWeddingEndpoint(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/wedding", async (WeddingContext dbContext, Wedding wedding) =>
        {
            dbContext.Weddings.Add(wedding);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/wedding/{wedding.Id}", wedding);
        });
    }

    private static bool GuestExists(WeddingContext dbContext, int id)
    {
        return dbContext.Guests.Any(e => e.Id == id);
    }
}