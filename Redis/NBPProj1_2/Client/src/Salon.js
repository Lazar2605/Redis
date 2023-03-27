export class Salon {
    constructor(id, email, password, name, phone, address, city, tip, mark, numOfMarks, workingTime, reservations, reservationsKey, photos, photosKey) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.tip = tip;
        this.mark = mark;
        this.numOfMarks = numOfMarks;
        this.workingTime = workingTime;
        this.reservations = reservations;
        this.reservationsKey = reservationsKey;
        this.photos = photos;
        this.photosKey = photosKey;
        this.kontejner = document.body;
    }

    crtaj(host) {
        fetch("http://localhost:5000/GetAllReservationsS/" + this.id)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(rezervacije => {
                    let divRezervacije = document.createElement("div");
                    divRezervacije.className = "Saloni";
                    host.appendChild(divRezervacije);
                    rezervacije.forEach(rezervacija => {
                        const date = new Date();
                        let day = date.getDate();
                        let month = date.getMonth() + 1;
                        let year = date.getFullYear();
                        let datumRez = rezervacija.date.split(".");
                        if (year <= datumRez[2] && month <= datumRez[1] && day <= datumRez[0])
                            this.crtajRezervaciju(rezervacija, divRezervacije);
                    });

                    let divProfil = document.createElement("div");
                    divProfil.className = "divRezervacije";
                    host.appendChild(divProfil);
                    let dugmeProfil = document.createElement("button");
                    dugmeProfil.innerHTML = "Profil";
                    dugmeProfil.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeProfil);

                    dugmeProfil.onclick = () => {
                        this.CrtajFormu("profil");
                    }

                    let dugmeDodajFrizera = document.createElement("button");
                    dugmeDodajFrizera.innerHTML = "Dodaj frizera";
                    dugmeDodajFrizera.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeDodajFrizera);

                    dugmeDodajFrizera.onclick = () => {
                        this.CrtajFormu("dodajFrizera");
                    }

                    let dugmeObrisiFrizera = document.createElement("button");
                    dugmeObrisiFrizera.innerHTML = "Obriši frizera";
                    dugmeObrisiFrizera.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeObrisiFrizera);

                    dugmeObrisiFrizera.onclick = () => {
                        this.CrtajFormu("obrisiFrizera");
                    }

                    
                    let dugmeDodajUslugu = document.createElement("button");
                    dugmeDodajUslugu.innerHTML = "Dodaj uslugu";
                    dugmeDodajUslugu.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeDodajUslugu);

                    dugmeDodajUslugu.onclick = () => {
                        this.CrtajFormu("dodajUslugu");
                    }

                    let dugmeObrisiUslugu = document.createElement("button");
                    dugmeObrisiUslugu.innerHTML = "Obriši uslugu";
                    dugmeObrisiUslugu.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeObrisiUslugu);

                    dugmeObrisiUslugu.onclick = () => {
                        this.CrtajFormu("obrisiUslugu");
                    }

                    let dugmeIzmeniCenuUsluge = document.createElement("button");
                    dugmeIzmeniCenuUsluge.innerHTML = "Izmeni cenu usluge";
                    dugmeIzmeniCenuUsluge.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeIzmeniCenuUsluge);

                    dugmeIzmeniCenuUsluge.onclick = () => {
                        this.CrtajFormu("izmeniCenu");
                    }

                    let dugmeOdjaviSe = document.createElement("button");
                    dugmeOdjaviSe.innerHTML = "Odjavi se";
                    dugmeOdjaviSe.className = "dugmeRezervacije";
                    divProfil.appendChild(dugmeOdjaviSe);

                    dugmeOdjaviSe.onclick = () => {
                        window.location.href = "./index.html";
                    }

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })
    }

    CrtajFormu(flag) {

        let zaBrisanje = document.querySelector(".registracija");
            if(zaBrisanje != null){
                zaBrisanje.parentNode.removeChild(zaBrisanje);
            }
            let divGlavni = document.createElement("div");
            divGlavni.classList.add("registracija");
            divGlavni.id = "registracija";
            document.body.appendChild(divGlavni);
        
            let divForma = document.createElement("div");
            divForma.classList.add("formaRegistracija");
            divGlavni.appendChild(divForma);
        
            let zatvori = document.createElement("div");
            zatvori.classList.add("zatvori");
            zatvori.innerHTML = "+";
            divForma.appendChild(zatvori);
            zatvori.onclick = () => {
                divGlavni.parentNode.removeChild(divGlavni);
            }
        
            let naslov = document.createElement("h1");
            if (flag == "profil")
                naslov.innerHTML = "Profil";
            else if (flag == "dodajFrizera")
                naslov.innerHTML = "Dodaj frizera";
            else if (flag == "dodajUslugu")
                naslov.innerHTML = "Dodaj uslugu";
            else if (flag == "obrisiUslugu")
                naslov.innerHTML = "Obriši uslugu";
            else if (flag == "obrisiFrizera")
                naslov.innerHTML = "Obriši frizera";
            else if (flag == "izmeniCenu")
                naslov.innerHTML = "Izmeni cenu usluge";
            naslov.className = "naslovReg";
            divForma.appendChild(naslov);
        
            let podaci = document.createElement("div");
            podaci.classList.add("podacii");
            divForma.appendChild(podaci);
        
            let host = document.createElement("div");
            host.className = "user";
            podaci.appendChild(host);

            if (flag == "profil")
                this.crtajProfil(divForma);
            else if (flag == "dodajFrizera")
                this.crtajDodajFrizera(divForma);
            else if (flag == "dodajUslugu")
                this.crtajDodajUslugu(divForma);
            else if (flag == "obrisiUslugu")
                this.crtajObrisiUslugu(divForma);
            else if (flag == "obrisiFrizera")
                this.crtajObrisiFrizera(divForma);
            else if (flag == "izmeniCenu")
                this.crtajIzmeniCenuUsluge(divForma);
    }

    crtajProfil(divForma) {

            let divUsername = document.createElement("div");


            divForma.appendChild(divUsername);
            let labelaUsername = document.createElement("label");
            labelaUsername.innerHTML = "Username: " + this.email;
            divUsername.appendChild(labelaUsername);
            

            let divTelefon = document.createElement("div");
            divForma.appendChild(divTelefon);
            let labelaTelefon = document.createElement("label");
            labelaTelefon.innerHTML = "Broj telefona: " + this.phone;
            divTelefon.appendChild(labelaTelefon);
            let dugmeIzmeniTelefon = document.createElement("button");
            dugmeIzmeniTelefon.innerHTML = "Izmeni broj telefona";
            divTelefon.appendChild(dugmeIzmeniTelefon);

            dugmeIzmeniTelefon.onclick = () => {
                divTelefon.removeChild(dugmeIzmeniTelefon);
                let inputIzmeniTelefon = document.createElement("input");
                inputIzmeniTelefon.type = "text";
                divTelefon.appendChild(inputIzmeniTelefon);
                let dugmePovrdiIzm = document.createElement("button");
                dugmePovrdiIzm.innerHTML = "Potvrdi izmenu";
                divTelefon.appendChild(dugmePovrdiIzm);

                dugmePovrdiIzm.onclick = () => {

                    if(inputIzmeniTelefon.value == null || inputIzmeniTelefon.value == undefined || inputIzmeniTelefon.value == "") {
                        alert("Niste uneli novi broj telefona");
                        return;
                    }

                    let salon =  {
                        "id": this.id,
                        "phone": inputIzmeniTelefon.value
                    }

                    fetch("http://localhost:5000/Salon/UpdateSalon",
                    {
                        method:"PUT",
                        headers:
                        {
                            "Accept": "application/json",
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify(salon)
                    })
                    .then(pp => {
                        if(pp.status == 200){
                            pp.text().then(data => {

                                alert(data);
                                divTelefon.removeChild(inputIzmeniTelefon);
                                divTelefon.removeChild(dugmePovrdiIzm);
                                divTelefon.appendChild(dugmeIzmeniTelefon);
                                labelaTelefon.innerHTML = "Broj telefona: " + inputIzmeniTelefon.value;
                            })
                        }
                        else{
                            pp.text().then(data => {
                                alert(data);
                            })
                        }   
                    })

                    
                }

            }

            let divAdresa = document.createElement("div");
            divForma.appendChild(divAdresa);
            let labelaAdresa = document.createElement("label");
            labelaAdresa.innerHTML = "Adresa: " + this.address + " " + this.city;
            divAdresa.appendChild(labelaAdresa);
            let dugmeIzmeniAdresu = document.createElement("button");
            dugmeIzmeniAdresu.innerHTML = "Izmeni adresu";
            divAdresa.appendChild(dugmeIzmeniAdresu);

            dugmeIzmeniAdresu.onclick = () => {
                divAdresa.removeChild(dugmeIzmeniAdresu);
                let inputIzmeniAdresu = document.createElement("input");
                inputIzmeniAdresu.type = "text";
                divAdresa.appendChild(inputIzmeniAdresu);
                let dugmePovrdiIzm2 = document.createElement("button");
                dugmePovrdiIzm2.innerHTML = "Potvrdi izmenu";
                divAdresa.appendChild(dugmePovrdiIzm2);

                dugmePovrdiIzm2.onclick = () => {

                    if(inputIzmeniAdresu.value == null || inputIzmeniAdresu.value == undefined || inputIzmeniAdresu.value == "") {
                        alert("Niste uneli novu adresu");
                        return;
                    }

                    let salon =  {
                        "id": this.id,
                        "address": inputIzmeniAdresu.value
                    }

                    fetch("http://localhost:5000/Salon/UpdateSalon",
                    {
                        method:"PUT",
                        headers:
                        {
                            "Accept": "application/json",
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify(salon)
                    })
                    .then(pp => {
                        if(pp.status == 200){
                            pp.text().then(data => {

                                alert(data);
                                divAdresa.removeChild(inputIzmeniAdresu);
                                divAdresa.removeChild(dugmePovrdiIzm2);
                                divAdresa.appendChild(dugmeIzmeniAdresu);
                                labelaAdresa.innerHTML = "Adresa: " + inputIzmeniAdresu.value + " " + this.city;
                            })
                        }
                        else{
                            pp.text().then(data => {
                                alert(data);
                            })
                        }   
                    })

                    
                }
                    
            }

            let divTip = document.createElement("div");
            divForma.appendChild(divTip);
            let labelaTip = document.createElement("label");
            labelaTip.innerHTML = "Tip salona: " + this.tip;
            divTip.appendChild(labelaTip);

            let divRadnoVreme = document.createElement("div");
            divForma.appendChild(divRadnoVreme);
            let labelaRadnoVreme = document.createElement("label");
            labelaRadnoVreme.innerHTML = "Trenutno radno vreme: ";
            divRadnoVreme.appendChild(labelaRadnoVreme);

            let pocetak = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "ne radi"];
            let kraj = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "ne radi"];
            let dani = ["ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota", "nedelja"];

            dani.forEach((dan,index) =>{
                let divDan = document.createElement("div");
                divDan.className = "labelaDan";
                divRadnoVreme.appendChild(divDan);
                let labelaDan = document.createElement("label");
                labelaDan.innerHTML = dan + ": " + this.workingTime[index];
                divDan.appendChild(labelaDan);

                let dugmeIzmeniRadnoVreme = document.createElement("button");
                dugmeIzmeniRadnoVreme.innerHTML = "izmeni";
                divDan.appendChild(dugmeIzmeniRadnoVreme);

                dugmeIzmeniRadnoVreme.onclick = () => {

                    let inputPocetak = document.createElement("select");
                    inputPocetak.className = "dan";
                    pocetak.forEach(vreme => {
                        let option = document.createElement("option");
                        option.innerHTML = vreme;
                        inputPocetak.appendChild(option);
                    })
                    let inputKraj = document.createElement("select");
                    inputKraj.className = "dan";
                    kraj.forEach((vreme,index)=> {
                        let option = document.createElement("option");
                        option.innerHTML = vreme;
                        option.id = index;
                        inputKraj.appendChild(option);
                    })
    
                    divDan.appendChild(inputPocetak);
                    divDan.appendChild(inputKraj);
                    divDan.removeChild(dugmeIzmeniRadnoVreme);

                    let potvrdi = document.createElement("button");
                    potvrdi.innerHTML = "potvrdi izmenu";
                    divDan.appendChild(potvrdi);

                    let divDugme = document.createElement("div");
                    divDugme.className = "Dugme";
                    host.appendChild(divDugme);
                    let dugme = document.createElement("button");
                    dugme.innerHTML = "Register";
                    divDugme.appendChild(dugme);
                    let niz = document.querySelectorAll(".dan");
                    niz.forEach((element, index) => {
                        
                        element.onchange = () => {
                            if(index%2 == 0) {
                                if(element.value == "ne radi") {
                                    niz[index+1].value = "ne radi";
                                }
                                else
                                    niz[index+1].value = "14:00";
                            }
                        }
        
                    })

                    potvrdi.onclick = () => {
                        let niz2;

                        if(inputPocetak.value == "ne radi") {
                            niz2 = "ne radi";
                        }
                        else {
                            niz2 = inputPocetak.value + "-" + inputKraj.value;
                        }

                        this.workingTime[index] = niz2;
                        console.log(this.workingTime);
                        let salon =  {
                            "id": this.id,
                            "workingTime" : this.workingTime
                        }

                        fetch("http://localhost:5000/Salon/UpdateSalon",
                        {
                            method:"PUT",
                            headers:
                            {
                                "Accept": "application/json",
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify(salon)
                        })
                        .then(pp => {
                            if(pp.status == 200){
                                pp.text().then(data => {
    
                                    alert(data);
                                    labelaDan.innerHTML = dan + ": " + inputPocetak.value + "-" + inputKraj.value;
                                    divDan.removeChild(inputPocetak);
                                    divDan.removeChild(inputKraj);
                                    divDan.removeChild(potvrdi);
                                    divDan.appendChild(dugmeIzmeniRadnoVreme);
                                })
                            }
                            else{
                                pp.text().then(data => {
                                    alert(data);
                                })
                            }   
                        })
                    }
                }
                
                

                
            })




            
            let divIzmeni = document.createElement("div");
            divForma.appendChild(divIzmeni); 
            let dugmeIzmeniPass = document.createElement("button");
            dugmeIzmeniPass.innerHTML = "Izmeni lozinku";
            divIzmeni.appendChild(dugmeIzmeniPass);

            dugmeIzmeniPass.onclick = () => {
                
                let stari = document.createElement("div");
                divIzmeni.appendChild(stari);
                let novi = document.createElement("div");
                divIzmeni.appendChild(novi);
                let inputStariPass = document.createElement("input");
                inputStariPass.type = "text";
                let inputNoviPass = document.createElement("input");
                inputNoviPass.type = "text";
                let labelaStariPass = document.createElement("label");
                labelaStariPass.innerHTML = "Stara lozinka: ";
                let labelaNoviPass = document.createElement("label");
                labelaNoviPass.innerHTML = "Nova lozinka: ";
                stari.appendChild(labelaStariPass);
                stari.appendChild(inputStariPass);
                novi.appendChild(labelaNoviPass);
                novi.appendChild(inputNoviPass);
                divIzmeni.removeChild(dugmeIzmeniPass);
                let dugmePotvrdiIzmenu = document.createElement("button");
                dugmePotvrdiIzmenu.innerHTML = "Potvrdi izmenu";
                divIzmeni.appendChild(dugmePotvrdiIzmenu);

                dugmePotvrdiIzmenu.onclick = () => {

                    if(inputStariPass.value == null || inputStariPass.value == undefined || inputStariPass.value == "") {
                        alert("Niste uneli staru lozinku");
                        return;
                    }
                    if(inputNoviPass.value == null || inputNoviPass.value == undefined || inputNoviPass.value == "") {
                        alert("Niste uneli novu lozinku");
                        return;
                    }
    
                    if(inputStariPass.value == this.password) {
    
                        let salon =  {
                            "id": this.id,
                            "password": inputNoviPass.value
                        }
        
                        fetch("http://localhost:5000/Salon/UpdateSalon",
                        {
                            method:"PUT",
                            headers:
                            {
                                "Accept": "application/json",
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify(salon)
                        })
                        .then(pp => {
                            if(pp.status == 200){
                                pp.text().then(data => {
    
                                    alert(data);
                                    divIzmeni.removeChild(stari);
                                    divIzmeni.removeChild(novi);
                                    divIzmeni.removeChild(dugmePotvrdiIzmenu);
                                    divIzmeni.appendChild(dugmeIzmeniPass);
    
        
                                })
                            }
                            else{
                                pp.text().then(data => {
                                    alert(data);
                                })
                            }   
                        })
                    }
                    else {
                        alert("Pogrešna stara lozinka");
                    }
                }
            }
            
    }

    crtajDodajFrizera(divForma) {

        let divIme = document.createElement("div");
        divForma.appendChild(divIme);
        let labelaIme = document.createElement("label");
        labelaIme.innerHTML = "Ime: ";
        divIme.appendChild(labelaIme);
        let inputIme = document.createElement("input");
        inputIme.type = "text";
        divIme.appendChild(inputIme);
        let divPrezime = document.createElement("div");
        divForma.appendChild(divPrezime);
        let labelaPrezime = document.createElement("label");
        labelaPrezime.innerHTML = "Prezime: ";
        divPrezime.appendChild(labelaPrezime);
        let inputPrezime = document.createElement("input");
        inputPrezime.type = "text";
        divPrezime.appendChild(inputPrezime);
        let divDodaj = document.createElement("div");
        divForma.appendChild(divDodaj);
        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.innerHTML = "Dodaj frizera";
        divDodaj.appendChild(dugmeDodaj);

        dugmeDodaj.onclick = () => {
            if(inputIme.value == null || inputIme.value == undefined || inputIme.value == "") {
                alert("Niste uneli ime");
                return;
            }
            if(inputPrezime.value == null || inputPrezime.value == undefined || inputPrezime.value == "") {
                alert("Niste uneli prezime");
                return;
            }
            let frizer = {
                "ime" : inputIme.value,
                "prezime" : inputPrezime.value,
                "idSalona" : this.id
            }
            fetch("http://localhost:5000/AddFrizer",
            {
            method:"POST",
            headers:
            {
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify(frizer)
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {

                        alert(data);

                    })
                }
                else{
                    pp.text().then(data => {
                        alert(data);
                    })
                }   
            })

        }
    }

    crtajDodajUslugu(divForma) {

        let divNaziv = document.createElement("div");
        divForma.appendChild(divNaziv);
        let labelaNaziv = document.createElement("label");
        labelaNaziv.innerHTML = "Naziv: ";
        divNaziv.appendChild(labelaNaziv);
        let inputNaziv = document.createElement("input");
        inputNaziv.type = "text";
        divNaziv.appendChild(inputNaziv);
        let divCena = document.createElement("div");
        divForma.appendChild(divCena);
        let labelaCena = document.createElement("label");
        labelaCena.innerHTML = "Cena: ";
        divCena.appendChild(labelaCena);
        let inputCena = document.createElement("input");
        inputCena.type = "number";
        divCena.appendChild(inputCena);
        let divDodaj = document.createElement("div");
        divForma.appendChild(divDodaj);
        let dugmeDodaj = document.createElement("button");
        dugmeDodaj.innerHTML = "Dodaj uslugu";
        divDodaj.appendChild(dugmeDodaj);

        dugmeDodaj.onclick = () => {
            if(inputNaziv.value == null || inputNaziv.value == undefined || inputNaziv.value == "") {
                alert("Niste uneli naziv");
                return;
            }
            if(inputCena.value == null || inputCena.value == undefined || inputCena.value == "") {
                alert("Niste uneli cenu");
                return;
            }
            let usluga = {
                "salonID" : this.id,
                "naziv" : inputNaziv.value,
                "cena" : inputCena.value
            }
            fetch("http://localhost:5000/Usluga/AddUsluga",
            {
            method:"POST",
            headers:
            {
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify(usluga)
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {

                        alert(data);

                    })
                }
                else{
                    pp.text().then(data => {
                        alert(data);
                    })
                }   
            })

        }
    }

    crtajObrisiFrizera(divForma) {
        let divFrizer = document.createElement("div");
        divForma.appendChild(divFrizer);
        let labelaFrizer = document.createElement("label");
        labelaFrizer.innerHTML = "Frizer: ";
        divFrizer.appendChild(labelaFrizer);
        let inputFrizer = document.createElement("select");
        fetch("http://localhost:5000/GetFrizereSalona/" + this.id,
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(frizeri => {
                    frizeri.forEach(frizer => {
                        let option = document.createElement("option");
                        option.innerHTML = frizer.ime + " " + frizer.prezime;
                        option.id = frizer.id;
                        inputFrizer.appendChild(option);
                    })
                    
                })
            }
        })

        divFrizer.appendChild(inputFrizer);

        let divBrisi = document.createElement("div");
        divForma.appendChild(divBrisi);
        let dugmeBrisi = document.createElement("button");
        dugmeBrisi.innerHTML = "Obriši frizera";
        divBrisi.appendChild(dugmeBrisi);

        dugmeBrisi.onclick = () => {
            fetch("http://localhost:5000/DeleteFrizer/" + inputFrizer.options[inputFrizer.selectedIndex].id + "/" + this.id,
            {
                method:"DELETE",
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {
                        alert(data);
                        let zatvori = document.querySelector(".zatvori");
                        zatvori.click();
                        
                    })
                }
                else{
                    pp.text().then(data => {
                        alert(data);
                        
                    })
                }
            })
        }
    }

    crtajObrisiUslugu(divForma) {
        let divUsluga = document.createElement("div");
        divForma.appendChild(divUsluga);
        let labelaUsluga = document.createElement("label");
        labelaUsluga.innerHTML = "Usluga: ";
        divUsluga.appendChild(labelaUsluga);
        let inputUsluga = document.createElement("select");
        fetch("http://localhost:5000/Usluga/GetUslugeSalona/" + this.id,
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(usluge => {
                    usluge.forEach(usluga => {
                        let option = document.createElement("option");
                        option.innerHTML = usluga.naziv + "(" + usluga.cena + " RSD)";
                        option.id = usluga.id;
                        inputUsluga.appendChild(option);
                    })
                    
                })
            }
        })

        divUsluga.appendChild(inputUsluga);

        let divBrisi = document.createElement("div");
        divForma.appendChild(divBrisi);
        let dugmeBrisi = document.createElement("button");
        dugmeBrisi.innerHTML = "Obriši uslugu";
        divBrisi.appendChild(dugmeBrisi);

        dugmeBrisi.onclick = () => {
            fetch("http://localhost:5000/Usluga/DeleteUsluga/" + inputUsluga.options[inputUsluga.selectedIndex].id + "/" + this.id,
            {
                method:"DELETE",
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {
                        alert(data);
                        let zatvori = document.querySelector(".zatvori");
                        zatvori.click();
                        
                    })
                }
                else{
                    pp.text().then(data => {
                        alert(data);
                        
                    })
                }
            })
        }
    }

    crtajObrisiFrizera(divForma) {
        let divFrizer = document.createElement("div");
        divForma.appendChild(divFrizer);
        let labelaFrizer = document.createElement("label");
        labelaFrizer.innerHTML = "Frizer: ";
        divFrizer.appendChild(labelaFrizer);
        let inputFrizer = document.createElement("select");
        fetch("http://localhost:5000/GetFrizereSalona/" + this.id,
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(frizeri => {
                    frizeri.forEach(frizer => {
                        let option = document.createElement("option");
                        option.innerHTML = frizer.ime + " " + frizer.prezime;
                        option.id = frizer.id;
                        inputFrizer.appendChild(option);
                    })
                    
                })
            }
        })

        divFrizer.appendChild(inputFrizer);

        let divBrisi = document.createElement("div");
        divForma.appendChild(divBrisi);
        let dugmeBrisi = document.createElement("button");
        dugmeBrisi.innerHTML = "Obriši frizera";
        divBrisi.appendChild(dugmeBrisi);

        dugmeBrisi.onclick = () => {
            fetch("http://localhost:5000/DeleteFrizer/" + inputFrizer.options[inputFrizer.selectedIndex].id + "/" + this.id,
            {
                method:"DELETE",
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {
                        alert(data);
                        let zatvori = document.querySelector(".zatvori");
                        zatvori.click();
                        
                    })
                }
                else{
                    pp.text().then(data => {
                        alert(data);
                        
                    })
                }
            })
        }
    }

    crtajIzmeniCenuUsluge(divForma) {

        let divUsluga = document.createElement("div");
        divForma.appendChild(divUsluga);
        let labelaUsluga = document.createElement("label");
        labelaUsluga.innerHTML = "Usluga: ";
        divUsluga.appendChild(labelaUsluga);
        let inputUsluga = document.createElement("select");
        fetch("http://localhost:5000/Usluga/GetUslugeSalona/" + this.id,
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(usluge => {
                    usluge.forEach(usluga => {
                        let option = document.createElement("option");
                        option.innerHTML = usluga.naziv + "(" + usluga.cena + " RSD)";
                        option.id = usluga.id;
                        inputUsluga.appendChild(option);
                    })
                    
                })
            }
        })

        divUsluga.appendChild(inputUsluga);

        let divNovaCena =  document.createElement("div");
        divUsluga.appendChild(divNovaCena);
        let labelaNovaCena = document.createElement("label");
        labelaNovaCena.innerHTML = "Nova cena: ";
        divNovaCena.appendChild(labelaNovaCena);

        let inputNovaCena = document.createElement("input");
        inputNovaCena.type = "number";
        divNovaCena.appendChild(inputNovaCena);

        let divIzmeni = document.createElement("div");
        divForma.appendChild(divIzmeni);
        let dugmeIzmeni = document.createElement("button");
        dugmeIzmeni.innerHTML = "Izmeni cenu usluge";
        divIzmeni.appendChild(dugmeIzmeni);

        dugmeIzmeni.onclick = () => {
            if(inputNovaCena.value == null || inputNovaCena.value == undefined || inputNovaCena.value == "") {
                alert("Unesite novu cenu");
                return;
            } 
            fetch("http://localhost:5000/Usluga/PromeniCenuUsluge/" + inputUsluga.options[inputUsluga.selectedIndex].id + "/" + this.id + "/" + inputNovaCena.value,
            {
                method:"PUT",
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {
                        alert(data);
                        let zatvori = document.querySelector(".zatvori");
                        zatvori.click();
                        
                    })
                }
                else{
                    pp.text().then(data => {
                        alert(data);
                        
                    })
                }
            })
        }
    }

    crtajRezervaciju(rezervacija, divRezervacije) {
        
        fetch("http://localhost:5000/User/GetUser/" + rezervacija.userRef)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(user => {
                    let divRez = document.createElement("div");
                    divRez.className = "divRezervacija2";
                    divRezervacije.appendChild(divRez);
                    let divIme = document.createElement("div");
                    divRez.appendChild(divIme);
                    let labelaIme = document.createElement("label");
                    labelaIme.innerHTML = "Rezervisao: " + user.name + " " + user.surname;
                    divIme.appendChild(labelaIme);
                    let divImejl = document.createElement("div");
                    divRez.appendChild(divImejl);
                    let labelaImejl = document.createElement("label");
                    labelaImejl.innerHTML = "Imejl: " + user.email;
                    divImejl.appendChild(labelaImejl);
                    let divTermin = document.createElement("div");
                    divRez.appendChild(divTermin);
                    let labelaTermin = document.createElement("label");
                    labelaTermin.innerHTML = "Termin: " + rezervacija.date + " u " + rezervacija.time;
                    divTermin.appendChild(labelaTermin);
                    let divUsluga = document.createElement("div");
                    divRez.appendChild(divUsluga);
                    let labelaUsluga = document.createElement("label");
                    fetch("http://localhost:5000/Usluga/GetUsluga/" + this.id + "/" + rezervacija.idUsluge)
                    .then(pp => {
                        if(pp.status == 200){
                            pp.json().then(usluga => {
                                labelaUsluga.innerHTML = "Usluga: " + usluga.naziv;
                                divUsluga.appendChild(labelaUsluga);

                            })
                        }
                        else{
                            pp.text().then(data => {
                                alert(data);
                            })
                        }   
                    })
                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })



        

    }
}
