using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.SignalR;
using NBPProj1_2.Constants;
using NBPProj1_2.Hub;
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
    public class UserController:Controller
    {
        private ConnectionMultiplexer redis;
        //private ConnectionMultiplexer redisPubSub;
        //private ISubscriber sub;
        //private IHubContext<SalonHub> hub;
        //string poruka;

        public UserController(/*IHubContext<SalonHub> hub*/)
        {
            redis = ConnectionMultiplexer.Connect("localhost:6379");
            //this.redisPubSub = ConnectionMultiplexer.Connect("127.0.0.1:6379");
            //this.sub = redisPubSub.GetSubscriber();
            //this.hub = hub;
            
        }

        [HttpPost]
        [Route("AddUser")]
        public async Task<ActionResult> AddUser([FromBody] User user)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string u = await db.StringGetAsync("User:"+user.Username);
                if(!string.IsNullOrEmpty(u))
                {
                    return BadRequest("Korisnik sa istim korisnickim imenom vec postoji");
                }
                string jsonUser = JsonSerializer.Serialize<User>(user);
                await db.StringSetAsync("User:"+user.Username, jsonUser);
                return Ok("Korisnik je uspesno registtrovan");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetUser/{username}")]  
        public async Task<ActionResult> GetUser(string username)
        {
            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    return BadRequest("Mora da se navede username");
                }
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if(string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa proslednjenim korisnickim imenom ne postoji");
                }
                User user = JsonSerializer.Deserialize<User>(jsonUser);   
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUser")]
        public async Task<ActionResult> UpdateUser([FromBody] User user)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + user.Username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa zadatim korisnickim imenom ne postoji");
                }
                User desUser = JsonSerializer.Deserialize<User>(jsonUser);
                desUser.Password = string.IsNullOrEmpty(user.Password) ? desUser.Password : user.Password;
                desUser.Name = string.IsNullOrEmpty(user.Name) ? desUser.Name : user.Name;
                desUser.Surname = string.IsNullOrEmpty(user.Surname) ? desUser.Surname : user.Surname;
                desUser.Email = string.IsNullOrEmpty(user.Email) ? desUser.Email : user.Email;
                string jsonUser2 = JsonSerializer.Serialize<User>(desUser);
                await db.StringSetAsync("User:"+user.Username, jsonUser2);
                return Ok("Korisnik je uspesno izmenjen");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

        [HttpDelete]
        [Route("DeleteUser/{username}")]
        public async Task<ActionResult> DeleteUser(string username)
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

                List<Reservation> res = (await db.ListRangeAsync(user.ReservationKey)).ToList()
                                        .Select(r => JsonSerializer.Deserialize<Reservation>(r))
                                        .ToList();
                foreach(Reservation r in res)
                {
                    Salon s = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(k => JsonSerializer.Deserialize<Salon>(k))
                            .Where(k => k.ID == r.SalonID)
                            .FirstOrDefault();
                    await db.ListRemoveAsync(s.ReservationsKey, JsonSerializer.Serialize(r));
                    int pom = -1;
                    for(int i = 0; i < s.Reservations.Count; i++)
                    {
                        if (s.Reservations[i].ID == r.ID)
                        {
                            pom = i; break;
                        }
                    }

                    await db.SortedSetRemoveAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(s));
                    s.Reservations.RemoveAt(pom);
                    await db.SortedSetAddAsync(Constatns.SalonsSortedSetKey, JsonSerializer.Serialize(s), s.Mark);

                    await db.ListRemoveAsync(Constatns.ReservationListKey, JsonSerializer.Serialize(r));
                }

                List<int> favSalons = (await db.ListRangeAsync(user.FavoriteSalonsKey)).ToList()
                                .Select(p => JsonSerializer.Deserialize<int>(p)).ToList();

                foreach (int fs in favSalons)
                {
                    Salon s = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == fs)
                            .FirstOrDefault();

                    await db.ListRemoveAsync(s.UsersFavoriteKey, JsonSerializer.Serialize(user));
                }

                List<int> follSalons = (await db.ListRangeAsync(user.FollowedSalonsKey)).ToList()
                                    .Select(p => JsonSerializer.Deserialize<int>(p)).ToList();

                foreach (int fs in follSalons)
                {
                    Salon s = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == fs)
                            .FirstOrDefault();

                    await db.ListRemoveAsync(s.UsersWhoFollowKey, JsonSerializer.Serialize(user));    // OVO NE RADI LEPO NE ZNAM STO
                }


                await db.KeyDeleteAsync(user.FollowedSalonsKey);
                await db.KeyDeleteAsync(user.FavoriteSalonsKey);
                await db.KeyDeleteAsync(user.ReservationKey);
                await db.KeyDeleteAsync("User:" + user.Username);

                return Ok("Korisnik je uspesno izbrisan");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }    

        [HttpPost]
        [Route("FollowSalon/{username}/{salonID}")]   
        public async Task<ActionResult> FollowSalon(string username,int salonID)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if(string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa zadatim korisnickim imenom ne postoji");
                }
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == salonID)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Salon sa zadatim id ne postoji");
                }
                User user = JsonSerializer.Deserialize<User>(jsonUser);
                var salons = await db.ListRangeAsync(user.FollowedSalonsKey);
                if (salons.Contains(salonID.ToString()))
                {
                    return BadRequest("Korisnik vec prati salon");
                }
                await db.ListLeftPushAsync(user.FollowedSalonsKey, salonID.ToString());
                user.FollowedSalons.Add(salon);

                await db.ListLeftPushAsync(salon.UsersWhoFollowKey, JsonSerializer.Serialize(user));

                /*await Task.Run(() =>
                {
                subScriber.Subscribe("frizer", (channel, message) =>
                {
                    //Output received message
                    Poruka p= new Poruka{
                        Sadrzaj =$"{message}",
                        Date=DateTime.Now.ToShortDateString(),
                        Time=$"{DateTime.Now:HH:mm:ss}",
                        Procitana=false

                    };
                    user.PrimljenePoruke.Add(p);

                    //Console.WriteLine($"[{DateTime.Now:HH:mm:ss}]: {$"Message {message} received successfully"}");
                });
                });*/


                await db.StringSetAsync("User:" + user.Username, JsonSerializer.Serialize(user));
                return Ok("Uspešno ste zapratili salon");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("UnfollowSalon/{username}/{salonID}")]
        public async Task<ActionResult> UnfollowSalon(string username,int salonID)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa zadatim korisnickim imenom ne postoji");
                }
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == salonID)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Salon sa zadatim id ne postoji");
                }
                User user = JsonSerializer.Deserialize<User>(jsonUser);
                var salons = await db.ListRangeAsync(user.FollowedSalonsKey);
                if (!salons.Contains(salonID.ToString()))
                {
                    return BadRequest("Korisnik ne prati salon");
                }
                await db.ListRemoveAsync(user.FollowedSalonsKey,salonID.ToString());
                int pom = -1;
                for(int i = 0; i < user.FollowedSalons.Count; i++)
                {
                    if (user.FollowedSalons[i].ID == salon.ID)
                    {
                        pom=i; break;
                    }
                }
                var salons2 = await db.ListRangeAsync(user.FavoriteSalonsKey);
                if (salons2.Contains(salonID.ToString()))
                {
                    await db.ListRemoveAsync(user.FavoriteSalonsKey, salonID.ToString());
                    int pom2 = -1;
                    for (int i = 0; i < user.FavoriteSalons.Count; i++)
                    {
                        if (user.FavoriteSalons[i].ID == salon.ID)
                        {
                            pom2 = i; break;
                        }
                    }
                    user.FavoriteSalons.RemoveAt(pom2);
                    
                }

                user.FollowedSalons.RemoveAt(pom);

                await db.ListRemoveAsync(salon.UsersWhoFollowKey, JsonSerializer.Serialize(user));

                await db.StringSetAsync("User:" + user.Username, JsonSerializer.Serialize(user));
                return Ok("Uspesno ste otpratili salon");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("AddSalonToFavorites/{username}/{salonID}")]
        public async Task<ActionResult> AddSalonToFavorites(string username, int salonID)
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
                string a = (await db.ListRangeAsync(user.FollowedSalonsKey)).ToList()
                            .Where(r => r.Equals(salonID.ToString()))
                            .FirstOrDefault();
                if (a == null)
                {
                    return BadRequest("Kao omiljeni salon moze da se oznaci samo salon koji se prati");
                }
                var salons = await db.ListRangeAsync(user.FavoriteSalonsKey);
                if (salons.Contains(salonID.ToString()))
                {
                    return BadRequest("Korisnik je vec oznacio salon kao omiljeni");
                }

                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == salonID)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Salon sa zadatim id ne postoji");
                }
                await db.ListLeftPushAsync(user.FavoriteSalonsKey, salonID.ToString());
                user.FavoriteSalons.Add(salon);
                await db.ListLeftPushAsync(salon.UsersFavoriteKey, JsonSerializer.Serialize(user));

                await db.StringSetAsync("User:" + user.Username, JsonSerializer.Serialize(user));
                return Ok("Uspesno ste dodali salon u listu omiljenih");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("RemoveSalonFromFavorites/{username}/{salonID}")]
        public async Task<ActionResult> RemoveSalonFromFavorites(string username, int salonID)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa zadatim korisnickim imenom ne postoji");
                }
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                             .Select(r => JsonSerializer.Deserialize<Salon>(r))
                             .Where(r => r.ID == salonID)
                             .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Salon sa zadatim id ne postoji");
                }
                User user = JsonSerializer.Deserialize<User>(jsonUser);
                var salons = await db.ListRangeAsync(user.FavoriteSalonsKey);
                if (!salons.Contains(salonID.ToString()))
                {
                    return BadRequest("Salon nije oznacen kao omiljeni");
                }

                await db.ListRemoveAsync(user.FavoriteSalonsKey, salonID.ToString());
                int pom = -1;
                for (int i = 0; i < user.FavoriteSalons.Count; i++)
                {
                    if (user.FavoriteSalons[i].ID == salon.ID)
                    {
                        pom = i; break;
                    }
                }
                user.FavoriteSalons.RemoveAt(pom);
                await db.ListRemoveAsync(salon.UsersFavoriteKey, JsonSerializer.Serialize(user));

                await db.StringSetAsync("User:" + user.Username, JsonSerializer.Serialize(user));
                return Ok("Uspesno ste uklonili salon iz liste omiljenih");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        //[HttpGet]
        //[Route("Sub")]  
        //public async Task<ActionResult> Sub()
        //{
        //    try
        //    {
        //        await Task.Run(() =>
        //        {
        //        subScriber.Subscribe("frizer", (channel, message) =>
        //        {
        //            poruka=message;
        //        });
        //    });
                
        //        return Ok(poruka);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}


        [HttpGet]
        [Route("Logovanje/{username}/{password}")]  
        public async Task<ActionResult> Logovanje(string username, string password)
        {
            try
            {             
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    Salon s = (await db.SortedSetRangeByScoreAsync("SalonsSortedSetKey")).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.Email == username)
                            .FirstOrDefault();
                    if(s == null)
                    {
                        return BadRequest("Ne postoji salon ili korisnik sa zadatim username-om");
                    }
                    if (s.Password == password)
                        return Ok("Salon:"+ s.ID +":Uspešno logovanje");
                    else
                        return BadRequest("Pogrešna lozinka");
                }
                User user = JsonSerializer.Deserialize<User>(jsonUser);
                /*foreach (Salon s in user.FollowedSalons) {
                    sub.Subscribe(s.Name + s.ID.ToString(), (chanel, message) =>
                    {
                        hub.Clients.All.SendAsync($"InfoNotification", message.ToString());
                    });
                }*/

                if (user.Password == password)
                    return Ok("Korisnik:"+ username +":Uspešno logovanje");
                else
                    return BadRequest("Pogrešna lozinka");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpGet]
        [Route("GetAllFollowedSalons/{username}")]
        public async Task<ActionResult> GetAllFollowedSalons(string username)
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
                return Ok(user.FollowedSalons);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetAllFavoritesSalons/{username}")]
        public async Task<ActionResult> GetAllFavoritesSalons(string username)
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
                return Ok(user.FavoriteSalons);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("ProveriDaLiPrati/{username}/{idSalona}")]
        public async Task<ActionResult> ProveriDaLiPrati(string username, int idSalona)
        {
            try
            {
                IDatabase db = redis.GetDatabase();
                string jsonUser = await db.StringGetAsync("User:" + username);
                if (string.IsNullOrEmpty(jsonUser))
                {
                    return BadRequest("Korisnik sa zadatim korisnickim imenom ne postoji");
                }
                Salon salon = (await db.SortedSetRangeByScoreAsync(Constatns.SalonsSortedSetKey)).ToList()
                            .Select(r => JsonSerializer.Deserialize<Salon>(r))
                            .Where(r => r.ID == idSalona)
                            .FirstOrDefault();
                if (salon == null)
                {
                    return BadRequest("Salon sa zadatim id ne postoji");
                }

                User user = JsonSerializer.Deserialize<User>(jsonUser);
                var salons1 = await db.ListRangeAsync(user.FollowedSalonsKey);
                var salons2 = await db.ListRangeAsync(user.FavoriteSalonsKey);
                int ret = 0;
                if (salons1.Contains(idSalona.ToString()))
                {
                    if(salons2.Contains(idSalona.ToString()))
                        ret=2;
                    else 
                        ret=1;
                }
                return Ok(ret);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
