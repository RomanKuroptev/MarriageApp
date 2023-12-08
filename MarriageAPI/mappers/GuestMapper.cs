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
            Allergy1 = guestDto.Allergy1,
            Allergy2 = guestDto.Allergy2,
            IsAttending1 = guestDto.IsAttending1,
            IsAttending2 = guestDto.IsAttending2,
            FoodPreference1 = guestDto.FoodPreference1,
            FoodPreference2 = guestDto.FoodPreference2,
            RSVPCode =guestDto.RSVPCode
        };
    }
}