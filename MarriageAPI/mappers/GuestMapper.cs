using MarriageAPI.Dto;

public static class GuestMapper
{
    public static Guest MapToGuestEntity(GuestDto guestDto)
    {
        return new Guest
        {
            Id = guestDto.Id,
            Name = guestDto.Name,
            Email = guestDto.Email,
            RSVPCode = Guid.NewGuid().ToString() // Generate a new RSVP code here
        };
    }
}