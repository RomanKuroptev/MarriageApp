// Guest.cs
public class Guest
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public bool IsAttending { get; set; }
    public string RSVPCode { get; set; }
}

// Wedding.cs
public class Wedding
{
    public int Id { get; set; }
    public string Venue { get; set; }
    public DateTime Date { get; set; }
}

// RSVP.cs
public class RSVP
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}