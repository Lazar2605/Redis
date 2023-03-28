import { User } from "./User.js";
import { Salon } from "./Salon.js";

let logovanje  = localStorage.getItem("logovanje");
if(logovanje.split(":")[0] == "Korisnik") {
    fetch("http://localhost:5000/User/GetUser/" + logovanje.split(":")[1])
    .then(pp => {
        if(pp.status == 200){
            pp.json().then(user => {
                var u = new User(user.username, user.password, user.name, user.surname, user.email, user.followedSalons, user.followedSalonsKey, user.favouriteSalons,
                    user.favouriteSalonsKey, user.reservations, user.reservationsKey, user.primljenePoruke);
                console.log(u);
                u.crtaj(document.body);
            })
        }
        else{
            p.text().then(data => {
                alert(data);
            })
        }   
    })
}
else if (logovanje.split(":")[0] == "Salon") {
    fetch("http://localhost:5000/Salon/GetSalon/" + logovanje.split(":")[1])
    .then(pp => {
        if(pp.status == 200){
            pp.json().then(salon => {
                var s = new Salon(salon.id, salon.email, salon.password, salon.name, salon.phone, salon.address, salon.city, salon.tip, salon.mark, salon.numOfMark, salon.workingTime, 
                    salon.reservations, salon.reservationsKey, salon.photos, salon.photosKey);
                s.crtaj(document.body);
            })
        }
        else{
            p.text().then(data => {
                alert(data);
            })
        }   
    })
}