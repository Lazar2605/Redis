using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;

namespace NBPProj1_2.Models
{
    public class Salon
    {
        public int ID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Tip { get; set; }
        public double Mark { get; set; }
        public int NumOfMarks { get; set; }
        public List<string> WorkingTime { get; set; }
        public List<Reservation> Reservations { get; set; } = new List<Reservation>();
        public string ReservationsKey 
        {
            get => $"Salon:{ID}:ReservationKey";
        }

        public List<Frizer> Frizeri { get; set; } = new List<Frizer>();
        public string FrizeriKey
        {
            get => $"Salon:{ID}:FrizeriKey";
        }

        public List<Usluga> Usluge { get; set; } = new List<Usluga>();
        public string UslugeKey
        {
            get => $"Salon:{ID}:UslugeKey";
        }

        public string UsersWhoFollowKey
        {
            get => $"Salon:{ID}:UsersWhoFollowKey";
        }

        public string UsersFavoriteKey
        {
            get => $"Salon:{ID}:UsersFavoriteKey";
        }
    }
}
