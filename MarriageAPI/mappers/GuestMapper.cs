using MarriageAPI.dto;
using MarriageAPI.Dto;

public static class GuestMapper
{
    public static Guest MapToGuestEntity(CreateGuestDto guestDto)
    {
        return new Guest
        {
            Name = guestDto.Name,
            RSVPCode = Guid.NewGuid().ToString(), // Generate a new RSVP code here
        };
    }

    public static Guest MapToGuestEntity(UpdateGuestDto guestDto)
    {
        return new Guest
        {
            Id = guestDto.Id,
            Name = guestDto.Name,
            Email = guestDto.Email,
            IsAttending = guestDto.IsAttending,
            FoodPreference = guestDto.FoodPreference,
            RSVPCode =guestDto.RSVPCode
        };
    }
}