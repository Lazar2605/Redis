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
    public class UslugaController : Controller
    {
        private ConnectionMultiplexer redis;
        public const string UslugaIdGenerator = "UslugaIdCounter";

        public UslugaController()
        {
            redis = ConnectionMultiplexer.Connect("localhost:6379");

            if (string.IsNullOrEmpty(redis.GetDatabase().StringGet(UslugaIdGenerator)))
                redis.GetDatabase().StringSet(UslugaIdGenerator, "1");

        }

        [HttpPost]
        [Route("AddUsluga")]
        public async Task<ActionResult> AddUsluga([FromBody] Usluga usluga)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == usluga.salonID)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Ne postoji salon za zadati id");
                }
                int id = int.Parse(await db.StringGetAsync(UslugaIdGenerator));
                await db.StringSetAsync(UslugaIdGenerator, (id + 1).ToString());
                usluga.ID = id;

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(salon));
                salon.Usluge.Add(usluga);
                string uslugaJson = JsonSerializer.Serialize(usluga);
                await db.ListLeftPushAsync(salon.UslugeKey, uslugaJson);
                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, salon.Mark);

                return Ok("Uspesno ste dodali uslugu");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetUslugeSalona/{salonID}")]
        public async Task<ActionResult> GetUslugeSalona(int salonID)
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

                return Ok(salon.Usluge);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetUsluga/{idSalona}/{idUsluge}")]  // KAD VRATIS REZERVACIJU ONA IMA ID USLUGE PA SA OVO VRATIS USLUGU DA NAVEDES STA JE FADE, MAKAZE...
        public  async Task<ActionResult> GetUsluga(int idSalona, int idUsluge)
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

                Usluga u = (await db.ListRangeAsync(salon.UslugeKey)).ToList()
                            .Select(us => JsonSerializer.Deserialize<Usluga>(us))
                            .Where(us => us.ID == idUsluge)
                            .FirstOrDefault() ;

                if (u != null)
                    return Ok(u);

                return BadRequest("Nedostupna usluga");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteUsluga/{idUsluge}/{idSalona}")]
        public async Task<ActionResult> DeleteUsluga(int idUsluge, int idSalona)
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

                Usluga u = (await db.ListRangeAsync(salon.UslugeKey)).ToList()
                            .Select(us => JsonSerializer.Deserialize<Usluga>(us))
                            .Where(us => us.ID == idUsluge)
                            .FirstOrDefault();

                if (u == null)
                {
                    return BadRequest("Ne postoji usluga za zadati id");
                }

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(salon));

                int pom = -1;
                int i = 0;
                foreach (Usluga f in salon.Usluge)
                {
                    if (f.ID == idUsluge)
                    {
                        pom = i;
                        break;
                    }
                    i++;
                }

                salon.Usluge.RemoveAt(pom);
                string frizerJson = JsonSerializer.Serialize(u);
                await db.ListRemoveAsync(salon.UslugeKey, frizerJson);
                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, salon.Mark);

                return Ok("Usluga je uspesno izbrisana");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("PromeniCenuUsluge/{idUsluge}/{idSalona}/{novaCena}")]
        public async Task<ActionResult> PromeniCenuUsluge(int idUsluge, int idSalona, int novaCena)
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

                Usluga u = (await db.ListRangeAsync(salon.UslugeKey)).ToList()
                            .Select(us => JsonSerializer.Deserialize<Usluga>(us))
                            .Where(us => us.ID == idUsluge)
                            .FirstOrDefault();

                if (u == null)
                {
                    return BadRequest("Ne postoji usluga za zadati id");
                }

                await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(salon));

                for (int i = 0; i<salon.Usluge.Count; i++)
                {
                    if (salon.Usluge[i].ID == idUsluge)
                    {
                        salon.Usluge[i].Cena = novaCena;
                    }
                }

                List<Usluga> usluge = (await db.ListRangeAsync(salon.UslugeKey)).ToList()
                                    .Select(us => JsonSerializer.Deserialize<Usluga>(us))
                                    .ToList();

                int pom = -1;
                for (int i = 0; i < usluge.Count; i++)
                {
                    if(idUsluge == usluge[i].ID)
                    {
                        pom = i; break;
                    }
                }

                u.Cena = novaCena;

                await db.ListSetByIndexAsync(salon.UslugeKey, pom, JsonSerializer.Serialize(u));
                string sJson = JsonSerializer.Serialize<Salon>(salon);
                await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, sJson, salon.Mark);

                return Ok("Cena je uspesno izmenjena");


            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
