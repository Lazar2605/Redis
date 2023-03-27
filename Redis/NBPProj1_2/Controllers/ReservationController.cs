using Microsoft.AspNetCore.Mvc;
using NBPProj1_2.Constants;
using NBPProj1_2.Models;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text.Json;
using System.Threading.Tasks;

namespace NBPProj1_2.Controllers
{
    public class ReservationController:Controller
    {
        private ConnectionMultiplexer redis;
        public const string ReservationIdGenerator = "ReservationIdGenerator";
        public const string ReservationListKey = "ReservationListKey";
        public ReservationController()
        {
            redis = ConnectionMultiplexer.Connect("localhost:6379");
            if (string.IsNullOrEmpty(redis.GetDatabase().StringGet(ReservationIdGenerator)))
                redis.GetDatabase().StringSet(ReservationIdGenerator, "1");
        }

        [HttpPost]
        [Route("AddReservation")]
        public async Task<ActionResult> AddReservation([FromBody]Reservation res)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + res.UserRef);
                if(string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa proslednjenim usernameom ne postoji");
                }
                Salon s = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(k => JsonSerializer.Deserialize<Salon>(k))
                            .Where(k => k.ID == res.SalonID)
                            .FirstOrDefault();
                if(s == null)
                {
                    return BadRequest("Salon za zadati ID ne postoji");
                }
                if(db.ListLength(ReservationListKey) > 0)
                {
                    List<Reservation> ress = (await db.ListRangeAsync(ReservationListKey)).ToList()
                                            .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                            .ToList();
                    foreach(Reservation r in ress)
                    {
                        if(r.Date.Equals(res.Date) && r.Time.Equals(res.Time) && r.SalonID == res.SalonID)
                        {
                            return BadRequest("Termin je vec zauzet");
                        }
                    }
                }
                int id = int.Parse(await db.StringGetAsync(ReservationIdGenerator));
                await db.StringSetAsync(ReservationIdGenerator, (id + 1).ToString());
                res.ID = id;

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(s));
                s.Reservations.Add(res);
                string resJson = JsonSerializer.Serialize(res);
                await db.ListLeftPushAsync(s.ReservationsKey, resJson);
                string sJson = JsonSerializer.Serialize<Salon>(s);
                //await db.SortedSetUpdateAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(s), s.Mark);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, s.Mark);

                User u = JsonSerializer.Deserialize<User>(jsonUser);
                u.Reservations.Add(res);
                await db.ListLeftPushAsync(u.ReservationKey, resJson);
                await db.StringSetAsync("User:" + u.Username,JsonSerializer.Serialize(u));

                await db.ListLeftPushAsync(ReservationListKey, JsonSerializer.Serialize(res));
                return Ok("Uspesno ste rezervisali termin");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteReservation/{resID}")]
        public async Task<ActionResult> DeleteReservation(int resID)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Reservation r = (await db.ListRangeAsync(ReservationListKey)).ToList()
                                .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                .Where(r => r.ID == resID)
                                .FirstOrDefault();
                if(r == null)
                {
                    return BadRequest("Ne postoji rezervacija za zadati ID");
                }
                string userJson = await db.StringGetAsync("User:" + r.UserRef);
                Salon s = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(k => JsonSerializer.Deserialize<Salon>(k))
                            .Where(k => k.ID == r.SalonID)
                            .FirstOrDefault();

                string resJson = JsonSerializer.Serialize(r);

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(s));
                int pom = -1;
                for(int i = 0; i < s.Reservations.Count; i++)
                {
                    if (s.Reservations[i].ID == r.ID)
                        pom = i;
                }
                s.Reservations.RemoveAt(pom);
                await db.ListRemoveAsync(s.ReservationsKey, resJson);
                string sJson = JsonSerializer.Serialize<Salon>(s);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, s.Mark);

                User u = JsonSerializer.Deserialize<User>(userJson);
                for (int i = 0; i < u.Reservations.Count; i++)
                {
                    if (u.Reservations[i].ID == r.ID)
                        pom = i;
                }
                u.Reservations.RemoveAt(pom);
                await db.ListRemoveAsync(u.ReservationKey, resJson);
                await db.StringSetAsync("User:" + u.Username, JsonSerializer.Serialize(u));

                await db.ListRemoveAsync(ReservationListKey, JsonSerializer.Serialize(r));
                return Ok("Rezervacija je uspesno izbrisana");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateReservation")]
        public async Task<ActionResult> UpdateReservation([FromBody] Reservation res)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                List<Reservation> r = (await db.ListRangeAsync(ReservationListKey)).ToList()
                                        .Select(k => JsonSerializer.Deserialize<Reservation>(k))
                                        .ToList();

                int pom = -1;
                Reservation rr = new Reservation();
                for(int i = 0; i < r.Count; i++)
                {
                    if (r[i].ID == res.ID)
                    {
                        pom = i;
                        rr = r[i];
                        break;
                    }
                }
                rr.Date = string.IsNullOrEmpty(res.Date) ? rr.Date : res.Date;
                rr.Time = string.IsNullOrEmpty(res.Time) ? rr.Time : res.Time;
                string resJson = JsonSerializer.Serialize(rr);
                await db.ListSetByIndexAsync(ReservationListKey, pom, resJson);

                string userJson = await db.StringGetAsync("User:" + rr.UserRef);
                User u = JsonSerializer.Deserialize<User>(userJson);
                Salon s = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(k => JsonSerializer.Deserialize<Salon>(k))
                            .Where(k => k.ID == rr.SalonID)
                            .FirstOrDefault();


                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(s));
                pom = -1;
                for (int i = 0; i < s.Reservations.Count; i++)
                {
                    if (s.Reservations[i].ID == rr.ID)
                    { 
                        pom = i; break;
                    }
                }
                s.Reservations.RemoveAt(pom);
                s.Reservations.Add(rr);
                List<Reservation> sr = (await db.ListRangeAsync(s.ReservationsKey)).ToList()
                                        .Select(k => JsonSerializer.Deserialize<Reservation>(k))
                                        .ToList();

                pom = -1;
                for (int i = 0; i < sr.Count; i++)
                {
                    if (sr[i].ID == rr.ID)
                    {
                        pom = i; break;
                    }
                }

                await db.ListSetByIndexAsync(s.ReservationsKey, pom, resJson);
                string sJson = JsonSerializer.Serialize<Salon>(s);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, s.Mark);

                pom = -1;
                for (int i = 0; i < u.Reservations.Count; i++)
                {
                    if (u.Reservations[i].ID == rr.ID)
                        pom = i;
                }
                u.Reservations.RemoveAt(pom);
                u.Reservations.Add(rr);
                List<Reservation> ur = (await db.ListRangeAsync(u.ReservationKey)).ToList()
                                        .Select(k => JsonSerializer.Deserialize<Reservation>(k))
                                        .ToList();
                pom = -1;
                for (int i = 0; i < sr.Count; i++)
                {
                    if (ur[i].ID == rr.ID)
                    {
                        pom = i; break;
                    }
                }

                await db.ListSetByIndexAsync(u.ReservationKey,pom, resJson);
                await db.StringSetAsync("User:" + u.Username, JsonSerializer.Serialize(u));

                return Ok("Uspesno ste izmenili rezervaciju");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllReservations/{username}")]
        public async Task<ActionResult> GetAllReservations(string username)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa zadatim korisnickim imenom ne postoji");
                }
                User user = JsonSerializer.Deserialize<User>(jsonUser);
                List<Reservation> res = (await db.ListRangeAsync(Constatns.ReservationListKey)).ToList()
                                        .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                        .Where(r => r.UserRef.Equals(username))
                                
                                        .ToList();
                if(res.Count == 0) 
                {
                    return BadRequest("Nema rezervacija");
                }
                

                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllReservationsS/{salonID}")]
        public async Task<ActionResult> GetAllReservationsS(int salonID)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon s = (await db.SortedSetRangeByScoreAsync("SalonsSortedSetKey")).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == salonID)
                            .FirstOrDefault();
                if (s == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                List<Reservation> res = (await db.ListRangeAsync(s.ReservationsKey)).ToList()
                                        .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                        .Where(r => r.SalonID == salonID)
                                        .ToList();
                if(res.Count == 0) 
                {
                    return BadRequest("Nema rezervacija");
                }
                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }





    }
}
