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
    public class FrizerController : Controller
    {

        private ConnectionMultiplexer redis;
        public const string FrizerIdGenerator = "FrizerIdGenerator";

        public FrizerController()
        {
            redis = ConnectionMultiplexer.Connect("localhost:6379");

            if (string.IsNullOrEmpty(redis.GetDatabase().StringGet(FrizerIdGenerator)))
                redis.GetDatabase().StringSet(FrizerIdGenerator, "1");

        }

        [HttpPost]
        [Route("AddFrizer")]
        public async Task<ActionResult> AddFizer([FromBody] Frizer frizer)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == frizer.idSalona)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }
                int id = int.Parse(await db.StringGetAsync(FrizerIdGenerator));
                await db.StringSetAsync(FrizerIdGenerator, (id + 1).ToString());
                frizer.ID = id;

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(salon));
                salon.Frizeri.Add(frizer);
                string frizerJson = JsonSerializer.Serialize(frizer);
                await db.ListLeftPushAsync(salon.FrizeriKey, frizerJson);
                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, salon.Mark);

                return Ok("Uspesno ste dodali frizera");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetFrizereSalona/{salonID}")]
        public async Task<ActionResult> GetFrizereSalona(int salonID)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == salonID)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                return Ok(salon.Frizeri);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetFrizer/{idSalona}/{idFrizera}")]  // KAD VRATIS REZERVACIJU ONA IMA ID FRIZERA PA SA OVO VRATIS IME I PREZIME FRIZERA
        public async Task<ActionResult> GetFrizer(int idSalona, int idFrizera)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                Frizer u = (await db.ListRangeAsync(salon.FrizeriKey)).ToList()
                            .Select(us => JsonSerializer.Deserialize<Frizer>(us))
                            .Where(us => us.ID == idFrizera)
                            .FirstOrDefault();

                if (u != null)
                    return Ok(u);

                return BadRequest("Frizer ne postoji");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteFrizer/{idFrizera}/{idSalona}")]
        public async Task<ActionResult> DeleteFrizer(int idFrizera, int idSalona)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                Frizer u = (await db.ListRangeAsync(salon.FrizeriKey)).ToList()
                            .Select(us => JsonSerializer.Deserialize<Frizer>(us))
                            .Where(us => us.ID == idFrizera)
                            .FirstOrDefault();

                if(u == null)
                {
                    return BadRequest("Ne postoji frizer za zadati id");
                }

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(salon));

                int pom = -1;
                int i = 0;
                foreach(Frizer f in salon.Frizeri)
                {
                    if (f.ID == idFrizera)
                    {
                        pom = i;
                        break;
                    }
                    i++;
                }

                salon.Frizeri.RemoveAt(pom);
                string frizerJson = JsonSerializer.Serialize(u);
                await db.ListRemoveAsync(salon.FrizeriKey, frizerJson);
                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, salon.Mark);

                return Ok("Frizer je uspesno izbrisan");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateFrizer")]
        public async Task<ActionResult> UpdateFrizer([FromBody] Frizer frizer)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == frizer.idSalona)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }

                Frizer u = (await db.ListRangeAsync(salon.FrizeriKey)).ToList()
                            .Select(us => JsonSerializer.Deserialize<Frizer>(us))
                            .Where(us => us.ID == frizer.ID)
                            .FirstOrDefault();

                if (u == null)
                {
                    return BadRequest("Ne postoji frizer za zadati id");
                }

                List<Frizer> frizeri = (await db.ListRangeAsync(salon.FrizeriKey)).ToList()
                                    .Select(us => JsonSerializer.Deserialize<Frizer>(us))
                                    .ToList();

                int pom = -1;
                for (int i = 0; i < frizeri.Count; i++)
                {
                    if (u.ID == frizeri[i].ID)
                    {
                        pom = i; break;
                    }
                }

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(salon));

                u.Ime = string.IsNullOrEmpty(frizer.Ime) ? u.Ime : frizer.Ime;
                u.Prezime = string.IsNullOrEmpty(frizer.Prezime) ? u.Prezime : frizer.Prezime;

                for (int i = 0; i < salon.Frizeri.Count; i++)
                {
                    if (salon.Frizeri[i].ID == u.ID)
                    {
                        salon.Frizeri[i].Ime = u.Ime;
                        salon.Frizeri[i].Prezime = u.Prezime;
                    }
                }

                await db.ListSetByIndexAsync(salon.FrizeriKey, pom, JsonSerializer.Serialize(u));
                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, salon.Mark);

                return Ok("Podaci su uspesno izmenjeni");


            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
