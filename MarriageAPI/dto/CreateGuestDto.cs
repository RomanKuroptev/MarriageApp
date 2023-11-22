
using System.ComponentModel.DataAnnotations;

namespace MarriageAPI.Dto
{
    public class CreateGuestDto
    {
        [Required]
        public string Name { get; set; }
    }
}
