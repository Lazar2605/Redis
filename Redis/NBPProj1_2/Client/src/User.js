export class User {
    constructor(username, password, name, surname, email, followedSalons, followedSalonsKey, favouriteSalons, favouriteSalonsKey, reservations, reservationsKey, primljenePoruke) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.followedSalons = followedSalons;
        this.followedSalonsKey = followedSalonsKey;
        this.favouriteSalons = favouriteSalons;
        this.favouriteSalonsKey = favouriteSalonsKey;
        this.reservations = reservations;
        this.reservationsKey = reservationsKey;
        this.primljenePoruke = primljenePoruke;
    }

    crtaj(host) {

        let divvv = document.createElement("div");
        divvv.className = "divvv";
        host.appendChild(divvv);

        let divPretraga = document.createElement("div");
        divPretraga.className = "divPretraga";
        divvv.appendChild(divPretraga);

        let divSelektPoOcenama = document.createElement("div");
        divSelektPoOcenama.className = "filter";
        //let labela = document.createElement("label");
        //labela.innerHTML = "Ocene";
        let selektPoOcenama = document.createElement("select");
        selektPoOcenama.className = "selektPoOcenama";
        let odNajvece = document.createElement("option");
        odNajvece.innerHTML = "Od najveće ocene";
        odNajvece.value = true;
        let odNajmanje = document.createElement("option");
        odNajmanje.innerHTML = "Od najmanje ocene";
        odNajmanje.value = false;
        //divSelektPoOcenama.appendChild(labela);
        selektPoOcenama.appendChild(odNajvece);
        selektPoOcenama.appendChild(odNajmanje);
        divSelektPoOcenama.appendChild(selektPoOcenama);
        divPretraga.appendChild(divSelektPoOcenama);

        let divSelektTip = document.createElement("div");
        divSelektTip.className = "filter";
        let labela = document.createElement("label");
        labela.innerHTML = "Tip ";
        let selektTip = document.createElement("select");
        selektTip.className = "selektTip";
        let svi = document.createElement("option");
        svi.innerHTML = "Svi";
        let muski = document.createElement("option");
        muski.innerHTML = "Muški";
        let zenski = document.createElement("option");
        zenski.innerHTML = "Ženski";
        divSelektTip.appendChild(labela);
        selektTip.appendChild(svi);
        selektTip.appendChild(muski);
        selektTip.appendChild(zenski);
        divSelektTip.appendChild(selektTip);
        divPretraga.appendChild(divSelektTip);

        let divGrad = document.createElement("div");
        divGrad.className = "filter";
        labela = document.createElement("label");
        labela.innerHTML = "Grad";
        let inputGrad = document.createElement("select");
        inputGrad.className = "inputGrad";
        let option = document.createElement("option");
        option.innerHTML = "Svi";
        inputGrad.appendChild(option);
        fetch("http://localhost:5000/Salon/GetAllCitiesOfSalons",
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(gradovi => {
                    gradovi.forEach(grad => {
                        let option = document.createElement("option");
                        option.innerHTML = grad;
                        inputGrad.appendChild(option);
                    })
                })
            }
        })



        divGrad.appendChild(labela);
        divGrad.appendChild(inputGrad);
        divPretraga.appendChild(divGrad);

        let divButton = document.createElement("div");
        divButton.className = "filter";
        let btnPretrazi = document.createElement("button");
        btnPretrazi.innerHTML = "Pretraži";
        divPretraga.appendChild(divButton);
        divButton.appendChild(btnPretrazi);

        btnPretrazi.onclick = () => {

            if(inputGrad.value == "Svi") {
                if(selektTip.value == "Svi") {
                    this.crtajSvi(divSaloni, selektPoOcenama);
                }
                else {
                    this.crtajSaloneTip(divSaloni, selektTip, selektPoOcenama);
                }
               
            }
            else if (selektTip.value == "Muški" || selektTip.value == "Ženski"){
                this.crtajSaloneTipGrad(divSaloni, selektTip, selektPoOcenama, inputGrad);
            }
            else if (selektTip.value == "Svi") {
                this.crtajSaloneGrad(divSaloni, selektPoOcenama, inputGrad);
            }
            
        }
        let divFF = document.createElement("div");
        divvv.appendChild(divFF);

        let divPracecenja = document.createElement("div");
        divFF.appendChild(divPracecenja);
        let divOmiljeni = document.createElement("div");
        divFF.appendChild(divOmiljeni);

        let dugmePracenja = document.createElement("button");
        dugmePracenja.innerHTML = "Zapraćeni saloni";
        divPracecenja.appendChild(dugmePracenja);
        let dugmeOmiljeni = document.createElement("button");
        dugmeOmiljeni.innerHTML = "Omiljeni saloni";
        divOmiljeni.appendChild(dugmeOmiljeni);

        
        
        let divSaloni = document.createElement("div");
        divSaloni.className = "Saloni";
        host.appendChild(divSaloni);

        dugmePracenja.onclick = () => {
            this.crtajZapraceneSalone(divSaloni);
        }

        dugmeOmiljeni.onclick = () => {
            this.crtajOmiljeneSalone(divSaloni);
        }

        this.crtajSvi(divSaloni, selektPoOcenama);

        let divRezervacije = document.createElement("div");
        divRezervacije.className = "divRezervacije";
        host.appendChild(divRezervacije);
        let divDugmeRezervacije = document.createElement("div");
        divRezervacije.appendChild(divDugmeRezervacije);
        let dugmeRezervacije = document.createElement("button");
        dugmeRezervacije.innerHTML = "Moje rezervacije";
        dugmeRezervacije.className = "dugmeRezervacije";
        divDugmeRezervacije.appendChild(dugmeRezervacije);

        let dugmeProfil = document.createElement("button");
        dugmeProfil.innerHTML = "Profil";
        dugmeProfil.className = "dugmeRezervacije";
        divRezervacije.appendChild(dugmeProfil);

        let dugmeOdjaviSe = document.createElement("button");
        dugmeOdjaviSe.innerHTML = "Odjavi se";
        dugmeOdjaviSe.className = "dugmeRezervacije";
        divRezervacije.appendChild(dugmeOdjaviSe);

        dugmeOdjaviSe.onclick = () => {
            window.location.href = "./index.html";
        }

        dugmeRezervacije.onclick = () => {

            this.CrtajFormu(null, this.username, "mojeRez", null);
        }

        dugmeProfil.onclick = () => {
            this.CrtajFormu(null, this.username, "profil", null);
        }
        
    }

    crtajSalon(salon, divSaloni, flag) {

        let divSalon = document.createElement("div");
        divSalon.className = "Salon";
        divSaloni.appendChild(divSalon);
        let divIme = document.createElement("div");
        let divDugmici = document.createElement("div");
        divDugmici.className = "divDugmici" + salon.id;
        divSalon.appendChild(divDugmici);
        divSalon.appendChild(divIme);
        let labelaIme = document.createElement("label");
        labelaIme.innerHTML = salon.name;
        let dugmeZaprati = document.createElement("button");
        let dugmeOmiljeni = document.createElement("button");
        fetch("http://localhost:5000/User/ProveriDaLiPrati/" + this.username + "/" + salon.id,
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(data => {
                    if (data == 0)
                        dugmeZaprati.innerHTML = "Zaprati";
                    else if (data == 1) {
                        dugmeZaprati.innerHTML = "Otprati";
                        dugmeOmiljeni.innerHTML = "Dodaj u omiljene";
                        dugmeOmiljeni.className = "dugmeOmiljeni" + salon.id;
                        divDugmici.appendChild(dugmeOmiljeni);
                    }
                    else if (data == 2) {
                        dugmeZaprati.innerHTML = "Otprati";
                        dugmeOmiljeni.innerHTML = "Ukloni iz omiljenih";
                        dugmeOmiljeni.className = "dugmeOmiljeni" + salon.id;
                        divDugmici.appendChild(dugmeOmiljeni);
                    }
                })
            }
        })

        
        divDugmici.appendChild(dugmeZaprati); 

        dugmeZaprati.onclick = () => {
            
            if(dugmeZaprati.innerHTML == "Zaprati") {

                fetch("http://localhost:5000/User/FollowSalon/" + this.username + "/" + salon.id,
                {
                    method:"POST",
                })
                .then(pp => {
                    if(pp.status == 200){
                        pp.text().then(data => {
                            alert(data);
                            dugmeZaprati.innerHTML = "Otprati";
                            dugmeOmiljeni.innerHTML = "Dodaj u omiljene";
                            dugmeOmiljeni.className = "dugmeOmiljeni" + salon.id;
                            divDugmici.appendChild(dugmeOmiljeni);
                            
                        })
                    }
                    else {
                        pp.text().then(data => {
                            alert(data);
                        })
                    }
                })
                
            }
            else if (dugmeZaprati.innerHTML == "Otprati") {
                fetch("http://localhost:5000/User/UnfollowSalon/" + this.username + "/" + salon.id,
                {
                    method:"DELETE",
                })
                .then(pp => {
                    if(pp.status == 200){
                        pp.text().then(data => {
                            alert(data);
                            dugmeZaprati.innerHTML = "Zaprati";
                            let divDugmici = document.querySelector(".divDugmici" + salon.id);
                            let dugmeOmiljeni = document.querySelector(".dugmeOmiljeni" + salon.id);
                            divDugmici.removeChild(dugmeOmiljeni);
                        })
                    }
                })
                
            }
        }

        dugmeOmiljeni.onclick = () => {
                                
            if(dugmeOmiljeni.innerHTML == "Dodaj u omiljene") {

                fetch("http://localhost:5000/User/AddSalonToFavorites/" + this.username + "/" + salon.id,
                {
                    method:"POST",
                })
                .then(pp => {
                    if(pp.status == 200){
                        pp.text().then(data => {
                            alert(data);
                            dugmeOmiljeni.innerHTML = "Ukloni iz omiljenih";
                        })
                    }
                })
            }
            else if (dugmeOmiljeni.innerHTML == "Ukloni iz omiljenih") {
                fetch("http://localhost:5000/User/RemoveSalonFromFavorites/" + this.username + "/" + salon.id,
                {
                    method:"DELETE",
                })
                .then(pp => {
                    if(pp.status == 200){
                        pp.text().then(data => {
                            alert(data);
                            dugmeOmiljeni.innerHTML = "Dodaj u omiljene";
                        })
                    }
                })
            }
        }
    
        divIme.appendChild(labelaIme); 
        let divAdresa = document.createElement("div");
        divSalon.appendChild(divAdresa);
        let labelaAdresa = document.createElement("label");
        labelaAdresa.innerHTML = salon.address;
        divAdresa.appendChild(labelaAdresa);
        let divGrad = document.createElement("div");
        divSalon.appendChild(divGrad);
        let labelaGrad = document.createElement("label");
        labelaGrad.innerHTML = salon.city;
        divGrad.appendChild(labelaGrad);
        let divTip = document.createElement("div");
        divSalon.appendChild(divTip);
        let labelaTip = document.createElement("label");
        labelaTip.innerHTML = salon.tip;
        divTip.appendChild(labelaTip);
        let divFrizeri = document.createElement("div");
        divSalon.appendChild(divFrizeri);
        let labelFrizeri = document.createElement("label");
        labelFrizeri.innerHTML = "Frizeri: ";
        divFrizeri.appendChild(labelFrizeri);

        fetch("http://localhost:5000/GetFrizereSalona/" + salon.id,
        {
            method:"GET",
        })
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(frizeri => {
                    frizeri.forEach((frizer, ind) => {
                        if (ind == 0) {
                            
                            let labelFrizeri2 = document.createElement("label");
                            labelFrizeri2.innerHTML = frizer.ime + " " + frizer.prezime;
                            divFrizeri.appendChild(labelFrizeri2);
                        }
                        else {
                            let labelFrizeri2 = document.createElement("label");
                            labelFrizeri2.innerHTML = " ," + frizer.ime + " " + frizer.prezime;
                            divFrizeri.appendChild(labelFrizeri2);
                        }

                    })
                    
                })
            }
        })

        let divTelefon = document.createElement("div");
        divSalon.appendChild(divTelefon);
        let labelaTelefon = document.createElement("label");
        labelaTelefon.innerHTML = "broj telefona: " + salon.phone;
        divTelefon.appendChild(labelaTelefon);
        let divRadnoVreme = document.createElement("div");
        divSalon.appendChild(divRadnoVreme);
        let labelaRadnoVreme = document.createElement("label");
        labelaRadnoVreme.innerHTML = "Radno vreme:";
        divRadnoVreme.appendChild(labelaRadnoVreme);
        let niz = ["ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota", "nedelja"]
        salon.workingTime.forEach((vreme,index) => {
            let divVreme = document.createElement("div");
            divSalon.appendChild(divVreme);
            let labelaVreme = document.createElement("label");
            labelaVreme.innerHTML = niz[index] + ":" + vreme;
            divVreme.appendChild(labelaVreme);
        })
        let divOcena = document.createElement("div");
        divSalon.appendChild(divOcena);
        let labelaOcena = document.createElement("label");
        labelaOcena.innerHTML = "ocena:" + salon.mark.toFixed(2) + " (broj glasova:" + salon.numOfMarks + ")";
        divOcena.appendChild(labelaOcena);
        let divOceni = document.createElement("div");
        divSalon.appendChild(divOceni);
        let btnOceni = document.createElement("button");
        btnOceni.innerHTML = "Oceni";
        let selektOcena = document.createElement("select");
        for (let i = 0; i < 5; i++) {
            
            let ocena = document.createElement("option");
            ocena.innerHTML = i+1;
            selektOcena.appendChild(ocena);
        }
        divOceni.appendChild(selektOcena);
        divOceni.appendChild(btnOceni);
        
        btnOceni.onclick = () => {
            

            fetch("http://localhost:5000/Salon/OceniSalon/" + Number(selektOcena.value) + "/" + salon.id + "/" + this.username,
            {
                method:"PUT",
            })
            .then(pp => {
                if(pp.status == 200){
                    pp.text().then(data => {
                        let selektPoOcenama = document.querySelector(".selektPoOcenama");
                        let selektTip = document.querySelector(".selektTip");
                        let inputGrad = document.querySelector(".inputGrad");
                        alert(data);
                        if (flag == "svi"){
                            this.crtajSvi(divSaloni, selektPoOcenama);
                        }
                        else if (flag == "tip") {
                            this.crtajSaloneTip(divSaloni, selektTip, selektPoOcenama);
                        }
                        else if (flag == "tipGrad") {
                            this.crtajSaloneTipGrad(divSaloni, selektTip, selektPoOcenama, inputGrad);
                        }
                        else if (flag == "grad") {
                            this.crtajSaloneGrad(divSaloni, selektPoOcenama, inputGrad);
                        }
                        else if (flag == "follow") {
                            this.crtajZapraceneSalone(divSaloni);
                        }
                        else if (flag == "favourite") {
                            this.crtajOmiljeneSalone(divSaloni);
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

        let divRezervisi = document.createElement("div");
        divSalon.appendChild(divRezervisi);
        let dugmeRezervisi = document.createElement("button");
        dugmeRezervisi.innerHTML = "Rezerviši termin";
        divRezervisi.appendChild(dugmeRezervisi);

        dugmeRezervisi.onclick = () => {
            this.CrtajFormu(salon, this.username, "rez", null);
        }

        let divCenovnik = document.createElement("div");
        divSalon.appendChild(divCenovnik);
        let dugmeCenovnik = document.createElement("button");
        dugmeCenovnik.innerHTML = "Cenovnik";
        divCenovnik.appendChild(dugmeCenovnik);

        dugmeCenovnik.onclick = () => {
            this.CrtajFormu(salon, null, "cenovnik", null);
        }
    }
    CrtajFormu(salon, username, flag, rezervacijaID){

        let zaBrisanje = document.querySelector(".registracija");
        if(zaBrisanje != null){
            zaBrisanje.parentNode.removeChild(zaBrisanje);
        }
        let divGlavni = document.createElement("div");
        divGlavni.classList.add("registracija");
        divGlavni.id = "registracija";
        document.body.appendChild(divGlavni);
    
        let divForma = document.createElement("div");
        if(flag == "rez" || flag == "izm" || flag == "profil" || flag == "cenovnik") {
            divForma.classList.add("formaRegistracija");
        }
        else if(flag == "mojeRez") {
            divForma.classList.add("formaRegistracija2");
        }
        divGlavni.appendChild(divForma);
    
        let zatvori = document.createElement("div");
        zatvori.classList.add("zatvori");
        zatvori.innerHTML = "+";
        divForma.appendChild(zatvori);
        zatvori.onclick = () => {
            divGlavni.parentNode.removeChild(divGlavni);
        }
    
        let naslov = document.createElement("h1");
        if(flag == "rez") {
            naslov.innerHTML = "Rezervacija";
        }
        else if(flag == "mojeRez") {
            naslov.innerHTML = "Rezervacije";
        }
        else if(flag == "izm") {
            naslov.innerHTML = "Izmena rezervacije";
        }
        else if(flag == "profil") {
            naslov.innerHTML = "Profil";
        }
        else if(flag == "cenovnik") {
            naslov.innerHTML = "Cenovnik";
        }

        naslov.className = "naslovReg";
        divForma.appendChild(naslov);
    
        let podaci = document.createElement("div");
        podaci.classList.add("podacii");
        divForma.appendChild(podaci);
    
        let host = document.createElement("div");
        host.className = "user";
        podaci.appendChild(host);
        
        if(flag == "rez") {
            this.crtajRez(salon, username, divForma, divGlavni, flag, null);
        }
        else if(flag == "mojeRez") {
            this.crtajMojeRez(divForma, divGlavni);
        }
        else if(flag == "izm") {
            this.crtajRez(salon, username, divForma, divGlavni, flag, rezervacijaID);
        }
        else if(flag == "profil") {
            this.crtajProfil(divForma);
        }
        else if(flag == "cenovnik") {
            this.crtajCenovnik(salon, divForma);
        }
        
    }

    crtajProfil(divForma) {

        let divUsername = document.createElement("div");
        divForma.appendChild(divUsername);
        let labelaUsername = document.createElement("label");
        labelaUsername.innerHTML = "Username: " + this.username;
        divUsername.appendChild(labelaUsername);
        

        let divIme = document.createElement("div");
        divForma.appendChild(divIme);
        let labelaIme = document.createElement("label");
        labelaIme.innerHTML = "Ime: " + this.name;
        divIme.appendChild(labelaIme);
        let divPrezime = document.createElement("div");
        divForma.appendChild(divPrezime);
        let labelaPrezime = document.createElement("label");
        labelaPrezime.innerHTML = "Prezime: " + this.surname;
        divPrezime.appendChild(labelaPrezime);
        let divImejl = document.createElement("div");
        divForma.appendChild(divImejl);
        let labelaImejl = document.createElement("label");
        labelaImejl.innerHTML = "Imejl: " + this.email;
        divImejl.appendChild(labelaImejl);

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

                    let user =  {
                        "username": this.username,
                        "password": inputNoviPass.value
                    }
    
                    fetch("http://localhost:5000/User/UpdateUser",
                    {
                        method:"PUT",
                        headers:
                        {
                            "Accept": "application/json",
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify(user)
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

        let divIzbirsi = document.createElement("div");
        divForma.appendChild(divIzbirsi); 
        let dugmeObrisiNalog = document.createElement("button");
        dugmeObrisiNalog.innerHTML = "Obriši nalog";
        divIzbirsi.appendChild(dugmeObrisiNalog);

        dugmeObrisiNalog.onclick = () => {
            var result = confirm("Da li ste sigurni?");
            if(result == false){
                event.preventDefault();
            }
            else
            {
                fetch("http://localhost:5000/User/DeleteUser/" + this.username,
                {
                    method:"DELETE",
                })
                .then(p => {
                    if(p.status == 200){
                        p.text().then(data => {
                            alert(data);
                            window.location.href = "./index.html";
                        })
                    }
                    else{
                        p.text().then(data => {
                            alert(data);
                        })
                    }
                })
            }
        }
        

    }

    crtajRez(salon, username, divForma, divGlavni, flag, rezervacijaID) {

        let divDatum = document.createElement("div");
        divForma.appendChild(divDatum);
        let labelaDatum = document.createElement("label");
        labelaDatum.innerHTML = "Datum: ";
        let datum = document.createElement("input");
        datum.type = "date";
        var now = new Date();
        var day = ("0" + now.getDate());
        
        var now = new Date();
        var month = (now.getMonth() + 1);               
        var day = now.getDate() + 1;
        if (month < 10) 
            month = "0" + month;
        if (day < 10) {
            day = "0" + day;
        }
        var today = now.getFullYear() + '-' + month + '-' + day ;
        datum.value = today;
        datum.id = now.getDay();
        divDatum.appendChild(labelaDatum);
        divDatum.appendChild(datum);


        let datumi = today.split("-");
        let izabranDatum = datumi[2] + "." + datumi[1] + "." + datumi[0];

        let divVreme = document.createElement("div");
        divForma.appendChild(divVreme);
        let labelaVreme = document.createElement("label");
        labelaVreme.innerHTML = "Slobodni termini: ";
        divVreme.appendChild(labelaVreme);
        let selektVreme = document.createElement("select");
        divVreme.appendChild(selektVreme);

        fetch("http://localhost:5000/Salon/GetFreeTerms/" + izabranDatum + "/" + salon.id + "/" + datum.id)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(termini => {
                    termini.forEach(termin => {
                        let optionVreme = document.createElement("option");
                        optionVreme.innerHTML = termin;
                        optionVreme.className = "optionVreme";
                        selektVreme.appendChild(optionVreme);
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })

        let divFrizer = document.createElement("div");
        divForma.appendChild(divFrizer);
        let labelaFrizer = document.createElement("label");
        labelaFrizer.innerHTML = "Frizer: ";
        divFrizer.appendChild(labelaFrizer);
        let selektFrizer = document.createElement("select");
        divFrizer.appendChild(selektFrizer);

        fetch("http://localhost:5000/GetFrizereSalona/"+ salon.id ,)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(frizeri => {
                    frizeri.forEach(frizer => {
                        let optionFri = document.createElement("option");
                        optionFri.innerHTML = frizer.ime + " " + frizer.prezime;
                        optionFri.className = "optionFri";
                        optionFri.id = frizer.id;
                        selektFrizer.appendChild(optionFri);
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })

        let divUsloge = document.createElement("div");
        divForma.appendChild(divUsloge);
        let labelaUsluge = document.createElement("label");
        labelaUsluge.innerHTML = "Usluga: ";
        divUsloge.appendChild(labelaUsluge);
        let selektUsluga = document.createElement("select");
        divUsloge.appendChild(selektUsluga);

        fetch("http://localhost:5000/Usluga/GetUslugeSalona/"+ salon.id ,)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(usluge => {
                    usluge.forEach(usluga => {
                        let optionUsl = document.createElement("option");
                        optionUsl.innerHTML = usluga.naziv + "(" + usluga.cena + " RSD)";
                        optionUsl.className = "optionUsl";
                        optionUsl.id = usluga.id;
                        selektUsluga.appendChild(optionUsl);
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })

        let divRez = document.createElement("div");
        divForma.appendChild(divRez);
        let dugmeRez = document.createElement("button");
        dugmeRez.innerHTML = "Potvrdi rezervaicju";
        divRez.appendChild(dugmeRez);

        if(flag == "izm") {
            divForma.removeChild(divFrizer);
            divForma.removeChild(divUsloge);
            dugmeRez.innerHTML = "Potvrdi izmenu";
        }

        dugmeRez.onclick = () => {
            let datumi = datum.value.split("-");
            let izabranDatum = datumi[2] + "." + datumi[1] + "." + datumi[0];
            let rez =  {
                "date": izabranDatum,
                "time": selektVreme.value,
                "salonID": salon.id,
                "userRef": username,
                "idUsluge": selektUsluga.options[selektUsluga.selectedIndex].id,
                "idFrizera": selektFrizer.options[selektFrizer.selectedIndex].id
            }
            if (selektVreme.value == "" || selektVreme.value == undefined || selektVreme.value == null){
                alert("Ne možete rezervisati za dan na koji salon ne radi");
                return;
            }
            if(flag == "rez") {

                fetch("http://localhost:5000/AddReservation",
                {
                    method:"POST",
                    headers:
                    {
                        "Accept": "application/json",
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(rez)
                })
                .then(pp => {
                        pp.text().then(data => {
                                alert(data); 
                        })  
                }) 
                     
            }
            else if (flag == "izm") {
                let rez =  {
                    "id" : rezervacijaID,
                    "date" : izabranDatum,
                    "time" : selektVreme.value,
                }


                console.log(rez);
                fetch("http://localhost:5000/UpdateReservation",
                {
                    method:"PUT",
                    headers:
                    {
                        "Accept": "application/json",
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(rez)
                })
                .then(pp => {
                        pp.text().then(data => {
                                alert(data); 
                        })  
                }) 
            }
            divGlavni.parentNode.removeChild(divGlavni); 
        }
        datum.onchange = () => {
            let dan = new Date(datum.value).getDay();
            let datumi = datum.value.split("-");
            let izabranDatum = datumi[2] + "." + datumi[1] + "." + datumi[0];
            let optionVreme = document.querySelectorAll(".optionVreme");
            optionVreme.forEach(ov => {
                selektVreme.removeChild(ov);
            })
            fetch("http://localhost:5000/Salon/GetFreeTerms/" + izabranDatum + "/" + salon.id + "/" + dan)
            .then(pp => {
                if(pp.status == 200){
                    pp.json().then(termini => {
                        termini.forEach(termin => {
                            let optionVreme = document.createElement("option");
                            optionVreme.innerHTML = termin;
                            optionVreme.className = "optionVreme";
                            selektVreme.appendChild(optionVreme);
                        });
    
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

    crtajMojeRez(divForma, divGlavni) {

        let divRezervacije = document.createElement("div");
        divRezervacije.className = "divRezervacije";
        divForma.appendChild(divRezervacije);
        fetch("http://localhost:5000/GetAllReservations/" + this.username)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(rezervacije => {
                    rezervacije.forEach(rezervacija => {

                        this.crtajRezervaciju(rezervacija, divRezervacije, divGlavni);
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                    divGlavni.parentNode.removeChild(divGlavni);

                })
            }   
        })
    }

    crtajRezervaciju(rezervacija, divRezervacije, divGlavni) {


        let divRezervacija = document.createElement("div");
        divRezervacija.className = "divRezervacija";
        divRezervacije.appendChild(divRezervacija);

        fetch("http://localhost:5000/Salon/GetSalon/" + rezervacija.salonID)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(salon => {
                    let divSalon = document.createElement("div");
                    divRezervacija.appendChild(divSalon);
                    let labelaNaziv = document.createElement("label");
                    labelaNaziv.innerHTML = "Naziv salona: ";
                    let labelaN = document.createElement("label");
                    labelaN.innerHTML = salon.name;
                    divSalon.appendChild(labelaNaziv); 
                    divSalon.appendChild(labelaN); 
                    let divDatumVreme = document.createElement("div");
                    divRezervacija.appendChild(divDatumVreme);
                    let labelaDatumVreme = document.createElement("label");
                    labelaDatumVreme.innerHTML = rezervacija.date + " u " + rezervacija.time;
                    divDatumVreme.appendChild(labelaDatumVreme); 
                    let divAdresa = document.createElement("div");
                    divRezervacija.appendChild(divAdresa);
                    let labelaAdresa = document.createElement("label");
                    labelaAdresa.innerHTML = salon.address + " " + salon.city;
                    divAdresa.appendChild(labelaAdresa);
                    let divIzmeniBrisi = document.createElement("div");
                    divRezervacija.appendChild(divIzmeniBrisi);
                    let dugmeIzmeni = document.createElement("button");
                    dugmeIzmeni.innerHTML = "Izmeni";
                    let dugmeBrisi = document.createElement("button");
                    dugmeBrisi.innerHTML = "Obriši";
                    divIzmeniBrisi.appendChild(dugmeIzmeni); 
                    divIzmeniBrisi.appendChild(dugmeBrisi); 

                    dugmeIzmeni.onclick = () => {
                         
                        this.CrtajFormu(salon, this.username, "izm", rezervacija.id);
                    }
                    dugmeBrisi.onclick = () => {
                        fetch("http://localhost:5000/DeleteReservation/" + rezervacija.id,
                        {
                            method:"DELETE",
                            headers:
                            {
                                "Accept": "application/json",
                                "Content-Type":"application/json"
                            },
                        })
                        .then(pp => {
                            pp.text().then(data => {
                                alert(data);
                            })
                        })
                        divGlavni.parentNode.removeChild(divGlavni);
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
    
    crtajSaloneTip(divSaloni, selektTip, selektPoOcenama) {

        divSaloni.innerHTML = "";
        fetch("http://localhost:5000/Salon/GetSalonsByType/" + selektTip.value + "/" + selektPoOcenama.value)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(saloni => {
                    saloni.forEach(salon => {
                        this.crtajSalon(salon, divSaloni, "tip");
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })
    }
    crtajSaloneTipGrad(divSaloni, selektTip, selektPoOcenama, inputGrad) {
        divSaloni.innerHTML = "";
                fetch("http://localhost:5000/Salon/GetSalonsByTypeAndCity/" + selektTip.value + "/" + inputGrad.value +"/"+ selektPoOcenama.value)
                .then(pp => {
                    if(pp.status == 200){
                        pp.json().then(saloni => {
                            saloni.forEach(salon => {
                                this.crtajSalon(salon, divSaloni, "tipGrad");
                            });
    
                        })
                    }
                    else{
                        pp.text().then(data => {
                            alert(data);
                        })
                    }   
                })
    }
    crtajSaloneGrad(divSaloni, selektPoOcenama, inputGrad) {
        divSaloni.innerHTML = "";
                fetch("http://localhost:5000/Salon/GetSalonsByCity/" + inputGrad.value +"/"+ selektPoOcenama.value)
                .then(pp => {
                    if(pp.status == 200){
                        pp.json().then(saloni => {
                            saloni.forEach(salon => {
                                this.crtajSalon(salon, divSaloni, "grad");
                            });
    
                        })
                    }
                    else{
                        pp.text().then(data => {
                            alert(data);
                        })
                    }   
                })
    }
    crtajSvi(divSaloni, selektPoOcenama) {
        divSaloni.innerHTML = "";
        fetch("http://localhost:5000/Salon/GetAllSalons/" + selektPoOcenama.value)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(saloni => {
                    saloni.forEach(salon => {
                        this.crtajSalon(salon, divSaloni, "svi");
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })
    }
    crtajZapraceneSalone(divSaloni) {
        divSaloni.innerHTML = "";
        fetch("http://localhost:5000/User/GetAllFollowedSalons/" + this.username)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(saloni => {
                    saloni.forEach(salon => {
                        this.crtajSalon(salon, divSaloni, "follow");
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })
    }

    crtajOmiljeneSalone(divSaloni) {
        divSaloni.innerHTML = "";
        fetch("http://localhost:5000/User/GetAllFavoritesSalons/" + this.username)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(saloni => {
                    saloni.forEach(salon => {
                        this.crtajSalon(salon, divSaloni, "favourite");
                    });

                })
            }
            else{
                pp.text().then(data => {
                    alert(data);
                })
            }   
        })
    }

    crtajCenovnik(salon, divForma) {
        fetch("http://localhost:5000/Usluga/GetUslugeSalona/" + salon.id)
        .then(pp => {
            if(pp.status == 200){
                pp.json().then(usluge => {
                    usluge.forEach(usluga => {
                        let div = document.createElement("div");
                        divForma.appendChild(div);
                        let label = document.createElement("label");
                        label.innerHTML = usluga.naziv + ": " + usluga.cena + " RSD"; 
                        div.appendChild(label);
                    });

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