
namespace MarriageAPI.Dto
{
    public class GuestDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsAttending { get; set; }
        public int PlusOneCount { get; set; }
    }
}
