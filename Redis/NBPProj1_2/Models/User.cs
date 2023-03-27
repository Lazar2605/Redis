using System.Collections.Generic;

namespace NBPProj1_2.Models
{
    public class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public List<Salon>? FollowedSalons { get; set; } = new List<Salon>();
        public string FollowedSalonsKey
        {
            get => (Username == string.Empty) ? string.Empty : $"{Username}:FollowedSalons";
        }
        public List<Salon>? FavoriteSalons { get; set; } = new List<Salon>();
        public string FavoriteSalonsKey
        {
            get => (Username == string.Empty) ? string.Empty : $"{Username}:FavoriteSalons";
        }
        public List<Reservation>? Reservations { get; set; } = new List<Reservation>();
        public string ReservationKey
        { 
            get => (Username == string.Empty) ? string.Empty : $"{Username}:ReservationKeyUser";
        }
        public List<Poruka>? PrimljenePoruke { get; set; } = new List<Poruka>();
    }
}
