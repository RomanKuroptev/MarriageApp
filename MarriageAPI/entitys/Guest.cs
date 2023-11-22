// Guest.cs
using System.ComponentModel.DataAnnotations;

public class Guest
{
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    public string? Email { get; set; }

    public string? FoodPreference { get; set; }

    public bool? IsAttending { get; set; }

    public string RSVPCode { get; set; }
}