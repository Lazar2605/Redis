using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace NBPProj1_2.Hub
{
    public class SalonHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task SetNot(string notification){
            await Clients.All.SendAsync("Notification", notification);
        }
    }
}