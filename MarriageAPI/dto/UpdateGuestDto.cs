using System.ComponentModel.DataAnnotations;

namespace MarriageAPI.dto
{
    public class UpdateGuestDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        public bool IsAttending { get; set; }
        public string FoodPreference { get; set; }
        public string RSVPCode { get; set; }
    }
}
