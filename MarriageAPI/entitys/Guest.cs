// Guest.cs
using System.ComponentModel.DataAnnotations;

public class Guest
{
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    public string? Email { get; set; }

    public string? Allergy1 { get; set; }

    public string? Allergy2 { get; set; }

    public string? FoodPreference1 { get; set; }
    public string? FoodPreference2 { get; set; }

    public bool? IsAttending1 { get; set; }
    public bool? IsAttending2 { get; set; }

    public string RSVPCode { get; set; }
}