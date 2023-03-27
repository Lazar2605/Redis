using Microsoft.AspNetCore.Mvc;
using NBPProj1_2.Constants;
using NBPProj1_2.Models;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace NBPProj1_2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SalonController : Controller
    {
        private ConnectionMultiplexer redis;
        public const string SalonIdGenerator = "SalonIdCounter";
        public string SalonsSortedSetKey;

        public SalonController()
        {
            redis = ConnectionMultiplexer.Connect("localhost:6379");
            
            SalonsSortedSetKey = "SalonsSortedSetKey";
            if (string.IsNullOrEmpty(redis.GetDatabase().StringGet(SalonIdGenerator)))
                redis.GetDatabase().StringSet(SalonIdGenerator, "1");

        }

        [HttpPost]
        [Route("AddSalon")]
        public async Task<ActionResult> AddSalon([FromBody] Salon salon)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.Email == salon.Email)
                            .FirstOrDefault();
                if(s != null)
                {
                    return BadRequest("Vec postoji prijavljeni salon sa prosledjenom email adresom");
                }
                int id = int.Parse(await db.StringGetAsync(SalonIdGenerator));
                await db.StringSetAsync(SalonIdGenerator, (id + 1).ToString());
                salon.ID = id;
                salon.Mark = 0.0;
                salon.NumOfMarks = 0;
                string jsonSalon = JsonSerializer.Serialize(salon);
                await db.SortedSetAddAsync(SalonsSortedSetKey, jsonSalon, salon.Mark);
                return Ok("Salon je uspesno dodat");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetSalon/{id}")]   
        public async Task<ActionResult> GetSalon(int id)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == id)
                            .FirstOrDefault();
                if(salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }
                return Ok(salon);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        } 

        [HttpGet]
        [Route("GetAllSalons/{fleg}")]  // vratiti i liste salona
        public async Task<ActionResult> GetAllSalons(bool fleg)  
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                List<Salon> salons = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey, double.NegativeInfinity, double.PositiveInfinity, Exclude.None, fleg ? Order.Descending : Order.Ascending)).ToList()
                                    .Select(p => JsonSerializer.Deserialize<Salon>(p))
                                    .ToList();
                if(salons.Count == 0)
                {
                    return BadRequest("Nema salona");
                }



                return Ok(salons);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetSalonsByCity/{city}/{fleg}")]
        public async Task<ActionResult> GetSalonsByCity(string city, bool fleg)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                List<Salon> salons = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey, double.NegativeInfinity, double.PositiveInfinity, Exclude.None, fleg ? Order.Descending : Order.Ascending)).ToList()
                                    .Select(p => JsonSerializer.Deserialize<Salon>(p))
                                    .Where(s => s.City == city)
                                    .ToList();
                if (salons.Count == 0)
                {
                    return BadRequest($"Nema salona za grad {city}");
                }

                return Ok(salons);
            }
            catch (Exception e)
            { 
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetSalonsByType/{tip}/{fleg}")]
        public async Task<ActionResult> GetSalonsByType(string tip,bool fleg)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                List<Salon> salons = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey, double.NegativeInfinity, double.PositiveInfinity, Exclude.None, fleg ? Order.Descending : Order.Ascending)).ToList()
                                    .Select(p => JsonSerializer.Deserialize<Salon>(p))
                                    .Where(s => s.Tip == tip)
                                    .ToList();
                if (salons.Count == 0)
                {
                    return BadRequest($"Nema salona za tip {tip}");
                }

                return Ok(salons);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetSalonsByTypeAndCity/{tip}/{city}/{fleg}")]
        public async Task<ActionResult> GetSalonsByTypeAndCity(string tip, string city,bool fleg)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                List<Salon> salons = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey, double.NegativeInfinity, double.PositiveInfinity, Exclude.None, fleg ? Order.Descending : Order.Ascending)).ToList()
                                    .Select(p => JsonSerializer.Deserialize<Salon>(p))
                                    .Where(s => s.Tip == tip && s.City == city)
                                    .ToList();
                if (salons.Count == 0)
                {
                    return BadRequest($"Nema salona koji zadovoljavaju prosledjene filtere");
                }

                return Ok(salons);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateSalon")]
        public async Task<ActionResult> UpdateSalon([FromBody] Salon salon)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == salon.ID)
                            .FirstOrDefault();
                if (s == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }
                await db.SortedSetRemoveAsync(SalonsSortedSetKey, JsonSerializer.Serialize(s));
                s.Password = string.IsNullOrEmpty(salon.Password) ? s.Password : salon.Password;
                s.Phone = string.IsNullOrEmpty(salon.Phone) ? s.Phone : salon.Phone;
                s.Name = string.IsNullOrEmpty(salon.Name) ? s.Name : salon.Name;
                s.Address = string.IsNullOrEmpty(salon.Address) ? s.Address : salon.Address;
                s.City = string.IsNullOrEmpty(salon.City) ? s.City : salon.City;
                s.Tip = string.IsNullOrEmpty(salon.Tip) ? s.Tip : salon.Tip;
                for (int i = 0; i < 7; i++)
                {
                    s.WorkingTime[i] = salon.WorkingTime == null ? s.WorkingTime[i] : salon.WorkingTime[i];
                }
                string sJson = JsonSerializer.Serialize<Salon>(s);
                await db.SortedSetAddAsync(SalonsSortedSetKey, sJson, salon.Mark);
                return Ok("Podaci o salonu su uspesno izmenjeni");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("OceniSalon/{ocena}/{id}/{username}")]
        public async Task<ActionResult> OceniSalon(int ocena, int id, string username)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == id)
                            .FirstOrDefault();
                if(salon == null)
                {
                    return BadRequest("Ne postoji salon za prosledjeni ID");
                }
                string jsonUser = await db.StringGetAsync("User:" + username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa proslednjenim korisnickim imenom ne postoji");
                }
                if(await db.ListLengthAsync("SalonMarksUsers:" + id) > 0) 
                {
                    User u = (await db.ListRangeAsync("SalonMarksUsers:" + id)).ToList()
                            .Select(p => JsonSerializer.Deserialize<User>(p))
                            .Where(p => p.Username == username)
                            .FirstOrDefault();
                    if (u != null)
                    {
                        return BadRequest("Korisnik je vec ocenio ovaj salon");
                    }
                }
                await db.SortedSetRemoveAsync(SalonsSortedSetKey, JsonSerializer.Serialize(salon));

                salon.Mark = ((salon.Mark * salon.NumOfMarks) + ocena) / (salon.NumOfMarks + 1);
                salon.NumOfMarks++;
                

                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(SalonsSortedSetKey, sJson, salon.Mark);
                

                await db.ListLeftPushAsync("SalonMarksUsers:" + id, jsonUser);

                return Ok("Uspesno ste ocenili salon");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteSalon/{id}")]
        public async Task<ActionResult> DeleteSalon(int id)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == id)
                            .FirstOrDefault();
                if (s == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                
                List<Reservation> res = (await db.ListRangeAsync(s.ReservationsKey)).ToList()
                                        .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                        .ToList();
                foreach (Reservation r in res)
                {
                    string jsonUser = await db.StringGetAsync("User:" + r.UserRef);
                    User u = JsonSerializer.Deserialize<User>(jsonUser);
                    await db.ListRemoveAsync(u.ReservationKey, JsonSerializer.Serialize(r));
                    int pom = -1;
                    for (int i = 0; i < u.Reservations.Count; i++)
                    {
                        if (u.Reservations[i].ID == r.ID)
                        {
                            pom = i; break;
                        }
                    }
                    u.Reservations.RemoveAt(pom);
                    await db.StringSetAsync("User:" + u.Username, JsonSerializer.Serialize(u));

                    await db.ListRemoveAsync(Constatns.ReservationListKey, JsonSerializer.Serialize(r));
                }
                await db.KeyDeleteAsync(s.ReservationsKey);

                List<User> follUsers = (await db.ListRangeAsync(s.UsersWhoFollowKey)).ToList()
                                        .Select(p => JsonSerializer.Deserialize<User>(p))
                                        .ToList();

                foreach (User u in follUsers)
                {
                    await db.ListRemoveAsync(u.FollowedSalonsKey, id.ToString());
                    int pom = -1;
                    for (int i = 0; i < u.FollowedSalons.Count; i++)
                    {
                        if (u.FollowedSalons[i].ID == id)
                        {
                            pom = i; break;
                        }
                    }

                    u.FollowedSalons.RemoveAt(pom);

                    await db.StringSetAsync("User:" + u.Username, JsonSerializer.Serialize(u));
                }

                await db.KeyDeleteAsync(s.UsersWhoFollowKey);

                List<User> favUsers = (await db.ListRangeAsync(s.UsersFavoriteKey)).ToList()
                                        .Select(p => JsonSerializer.Deserialize<User>(p))
                                        .ToList();

                foreach (User u in favUsers)
                {
                    string jsonUser = await db.StringGetAsync("User:" + u.Username);
                    User uu = JsonSerializer.Deserialize<User>(jsonUser);
                    await db.ListRemoveAsync(u.FavoriteSalonsKey, id.ToString());
                    int pom = -1;
                    for (int i = 0; i < uu.FavoriteSalons.Count; i++)
                    {
                        if (uu.FavoriteSalons[i].ID == id)
                        {
                            pom = i; break;
                        }
                    }

                    uu.FavoriteSalons.RemoveAt(pom);

                    await db.StringSetAsync("User:" + uu.Username, JsonSerializer.Serialize(uu));
                }

                await db.KeyDeleteAsync(s.UsersFavoriteKey);

                List<Frizer> f = (await db.ListRangeAsync(s.FrizeriKey)).ToList()
                                .Select(ff => JsonSerializer.Deserialize<Frizer>(ff))
                                .ToList();

                foreach(Frizer fr in f)
                {
                    await db.ListRemoveAsync(s.FrizeriKey, JsonSerializer.Serialize(fr));
                }

                List<Usluga> us = (await db.ListRangeAsync(s.UslugeKey)).ToList()
                                .Select(ff => JsonSerializer.Deserialize<Usluga>(ff))
                                .ToList();

                foreach (Usluga u in us)
                {
                    await db.ListRemoveAsync(s.UslugeKey, JsonSerializer.Serialize(u));
                }

                await db.KeyDeleteAsync(s.FrizeriKey);
                await db.KeyDeleteAsync(s.UslugeKey);



                await db.SortedSetRemoveAsync(SalonsSortedSetKey, JsonSerializer.Serialize(s));

                return Ok("Salon je uspesno izbrisan");
            }
            catch (Exception e) 
            {
                return BadRequest(e.Message);
            }            
        }

        [HttpGet]
        [Route("GetFreeTerms/{datum}/{idSalona}/{dan}")]
        public async Task<ActionResult> GetFreeTerms(string datum, int idSalona, int dan)   ///dan je 0-6 nedelja-subota npr. četvrtak je 4
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();
                if (s == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                List<Reservation> res = (await db.ListRangeAsync(s.ReservationsKey)).ToList()
                                        .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                        .Where(r => r.SalonID == idSalona)
                                        .ToList();
                string vreme;
                if (s == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }
                if(dan != 0){
                    vreme = s.WorkingTime[(dan - 1) % 7];
                }
                else 
                {
                    vreme = s.WorkingTime[6];
                }
                if(vreme == "ne radi")
                    return BadRequest("Ne radi tog dana!");
                string pocetak = vreme.Split("-")[0];
                string kraj = vreme.Split("-")[1];

                int p = Int32.Parse(pocetak.Split(":")[0]);
                int k = Int32.Parse(kraj.Split(":")[0]);

                List<string> termini1 = new List<string>();
                List<string> termini2 = new List<string>();

                for (int i = p; i < k; i++)
                {
                    termini1.Add(i + ":00");
                    termini2.Add(i + ":00");
                }
                
                foreach (Reservation r in res) 
                {
                    if (r.Date.Equals(datum)) 
                    {
                        foreach (string str in termini1)
                        {
                            if(r.Time.Equals(str)) 
                            {
                                termini2.Remove(str);
                            }
                        }
                    }
                }
                return Ok(termini2);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllCitiesOfSalons")]  
        public async Task<ActionResult> GetAllCitiesOfSalons()  
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                List<Salon> salons = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                                    .Select(p => JsonSerializer.Deserialize<Salon>(p))
                                    .ToList();
                if(salons.Count == 0)
                {
                    return BadRequest("Nema salona");
                }
                List<string> gradovi = new List<string>();
                foreach (Salon s in salons)
                {
                    gradovi.Add(s.City);
                }

                return Ok(gradovi.Distinct());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost]
        [Route("SetNotification/{mess}/{idSalona}")]
        public async Task<ActionResult> SetNotification(string mess, int idSalona)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();
                if (s == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                Poruka p = new Poruka();
                p.Salon = s.Name;
                p.Sadrzaj = mess;
                p.Procitana = false;
                p.Time = DateTime.Now;

                var redisPubSub = ConnectionMultiplexer.Connect("127.0.0.1:6379");
                ISubscriber pub = redisPubSub.GetSubscriber();
                pub.Publish(s.Name + s.ID.ToString(), JsonSerializer.Serialize(p));

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpGet]
        [Route("PomFja1/{idSalona}")]
        public async Task<ActionResult> PomFja1(int idSalona)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();

                List<User> pom = (await db.ListRangeAsync(s.UsersWhoFollowKey)).ToList()
                                .Select(p => JsonSerializer.Deserialize<User>(p))
                                .ToList();

                return Ok(pom);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpGet]
        [Route("PomFja2/{idSalona}")]
        public async Task<ActionResult> PomFja2(int idSalona)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync(SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();

                List<User> pom = (await db.ListRangeAsync(s.UsersFavoriteKey)).ToList()
                                .Select(p => JsonSerializer.Deserialize<User>(p))
                                .ToList();

                return Ok(pom);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}