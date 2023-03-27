using System.IO.Pipelines;

namespace NBPProj1_2.Models
{
    public class Reservation
    {
        public int ID { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public int SalonID { get; set; }
        public string UserRef { get; set; }
        public int IDUsluge { get; set; }
        public int IDFrizera { get; set; }
    }
}
