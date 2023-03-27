using System;
using System.IO.Pipelines;

namespace NBPProj1_2.Models
{
    public class Poruka
    {
        public string Salon { get; set; }
        public DateTime Time { get; set; }
        public string Sadrzaj { get; set; }
        public bool Procitana { get; set; }
    }
}