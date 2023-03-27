
export class Logovanje{
    constructor(kontejner){
        this.kontejner = kontejner;
    }

    Crtaj(){
        
        let divLog = document.createElement("div");
        divLog.className="Log";
        this.kontejner.appendChild(divLog);
        let dugmePrijaviSe = document.createElement("button");
        dugmePrijaviSe.innerHTML = "Log in";
        dugmePrijaviSe.class="dugmeReg";
        let inputUsername = document.createElement("input");
        inputUsername.className="divDugmeReg";
        inputUsername.type = "text";
        let inputLozinka = document.createElement("input");
        inputLozinka.className="divDugmeReg";
        inputLozinka.type = "password";
        let divLabel1 = document.createElement("div");
        divLabel1.className="divDugmeReg";
        let labela1 = document.createElement("label"); 
        labela1.innerHTML = "Username";
        divLog.appendChild(divLabel1);
        divLabel1.appendChild(labela1);
        let divInput1 = document.createElement("div");
        divLog.appendChild(divInput1);
        divInput1.appendChild(inputUsername);
        let divLabel2 = document.createElement("div");
        divLabel2.className="divDugmeReg";
        let labela2 = document.createElement("label"); 
        labela2.innerHTML = "Password";
        divLog.appendChild(divLabel2);
        divLabel2.appendChild(labela2);
        let divInput2 = document.createElement("div");
        divLog.appendChild(divInput2);
        divInput2.appendChild(inputLozinka);
        let divDugme = document.createElement("div");
        divDugme.className="divDugmeReg";
        divLog.appendChild(divDugme);
        divDugme.appendChild(dugmePrijaviSe);
        let divDugme1 = document.createElement("div");
        divLog.appendChild(divDugme1);
        let dugmeRegistrujSeU = document.createElement("button");
        divDugme1.className="divDugmeReg";
        dugmeRegistrujSeU.innerHTML = "Register as user";
        divDugme1.appendChild(dugmeRegistrujSeU);
        let divDugme2 = document.createElement("div");
        divLog.appendChild(divDugme2);
        let dugmeRegistrujSeS = document.createElement("button");
        divDugme2.className="divDugmeReg";
        dugmeRegistrujSeS.innerHTML = "Register as salon";
        divDugme2.appendChild(dugmeRegistrujSeS);

        dugmePrijaviSe.onclick = () => {
            if(inputUsername.value == "" || inputUsername.value == null || inputUsername.value == undefined) {
                alert("Unesite username");
                return;
            }
            if (inputLozinka.value == "" || inputLozinka.value == null || inputLozinka.value == undefined) {
                alert("Unesite password");
                return;
            }
            fetch("http://localhost:5000/User/Logovanje/" + inputUsername.value + "/" + inputLozinka.value,
            {
                method:"GET",
            })
            .then(p => {
                if(p.status == 200){
                    p.text().then(ppp=> {
                        localStorage.setItem("logovanje", ppp);
                        window.location.href = "./glavna.html";
                        
                    })
                }
                else {
                    p.text().then(data => {
                        alert(data);
                    })
                }
            })
        }

        dugmeRegistrujSeU.onclick = () => {
            CrtajFormu("u");
        }

        dugmeRegistrujSeS.onclick = () => {
            CrtajFormu("s");
        }
    
        function CrtajFormu(flag){

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
            naslov.innerHTML = "Registracija";
            naslov.className = "naslovReg";
            divForma.appendChild(naslov);
        
            let podaci = document.createElement("div");
            podaci.classList.add("podacii");
            divForma.appendChild(podaci);
        
            let host = document.createElement("div");
            host.className = "user";
            podaci.appendChild(host);
            
            if(flag == "u")
                CrtajRegistrujKorisnika(host);
            else if(flag == "s")
                CrtajRegistrujSalon(host)
        }

        function CrtajRegistrujKorisnika(host) { 

            let divUsername = document.createElement("div");
            divUsername.className = "labelaUsername";
            host.appendChild(divUsername);
            let labelaUsername = document.createElement("label");
            labelaUsername.innerHTML = "Username";
            let inputUsername = document.createElement("input");
            inputUsername.type = "text";
            divUsername.appendChild(labelaUsername);
            divUsername.appendChild(inputUsername);

            let divPassword = document.createElement("div");
            divPassword.className = "labelaPassword";
            host.appendChild(divPassword);
            let labelaPassword = document.createElement("label");
            labelaPassword.innerHTML = "Password";
            let inputPassword = document.createElement("input");
            inputPassword.type = "text";
            divPassword.appendChild(labelaPassword);
            divPassword.appendChild(inputPassword);

            let divIme = document.createElement("div");
            divIme.className = "labelaIme";
            host.appendChild(divIme);
            let labelaIme = document.createElement("label");
            labelaIme.innerHTML = "Name";
            let inputIme = document.createElement("input");
            inputIme.type = "text";
            divIme.appendChild(labelaIme);
            divIme.appendChild(inputIme);

            let divPrezime = document.createElement("div");
            divPrezime.className = "labelaPrezime";
            host.appendChild(divPrezime);
            let labelaPrezime = document.createElement("label");
            labelaPrezime.innerHTML = "Surname";
            let inputPrezime = document.createElement("input");
            inputPrezime.type = "text";
            divPrezime.appendChild(labelaPrezime);
            divPrezime.appendChild(inputPrezime);

            let divImejl = document.createElement("div");
            divImejl.className = "labelaImejl";
            host.appendChild(divImejl);
            let labelaImejl = document.createElement("label");
            labelaImejl.innerHTML = "Email";
            let inputImejl = document.createElement("input");
            inputImejl.type = "text";
            divImejl.appendChild(labelaImejl);
            divImejl.appendChild(inputImejl);

            let divDugme = document.createElement("div");
            divDugme.className = "Dugme";
            host.appendChild(divDugme);
            let dugme = document.createElement("button");
            dugme.innerHTML = "Register";
            divDugme.appendChild(dugme);

            
            
            
            dugme.onclick = () => {
                if(inputUsername.value == "" || inputUsername.value == null || inputUsername.value == undefined) {
                    alert("Unesite username");
                    return;
                }
                if (inputPassword.value == "" || inputPassword.value == null || inputPassword.value == undefined) {
                    alert("Unesite password");
                    return;
                }
                if (inputIme.value == "" || inputIme.value == null || inputIme.value == undefined) {
                    alert("Unesite ime");
                    return;
                }
                if (inputPrezime.value == "" || inputPrezime.value == null || inputPrezime.value == undefined) {
                    alert("Unesite prezime");
                    return;
                }
                if (inputImejl.value == "" || inputImejl.value == null || inputImejl.value == undefined) {
                    alert("Unesite imejl");
                    return;
                }
                let user =  {
                    "username": inputUsername.value,
                    "password": inputPassword.value,
                    "name": inputIme.value,
                    "surname": inputPrezime.value,
                    "email": inputImejl.value
                }
                fetch("http://localhost:5000/User/AddUser",
                {
                    method:"POST",
                    headers:
                    {
                        "Accept": "application/json",
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(user)
                }).then(r=>
                    {
                        if(r.status==200)
                        {
                            alert("Uspešna regstracija korisnika");
                            let divGlavni = document.querySelector(".registracija");
                            divGlavni.parentNode.removeChild(divGlavni);
                        }
                        else 
                            r.text().then(data => {
                                alert(data);
                            })
                    })
                
            }

            
        }
        function CrtajRegistrujSalon(host) {
            let divImejl = document.createElement("div");
            divImejl.className = "labelaImejl";
            host.appendChild(divImejl);
            let labelaImejl = document.createElement("label");
            labelaImejl.innerHTML = "Email";
            let inputImejl = document.createElement("input");
            inputImejl.type = "text";
            divImejl.appendChild(labelaImejl);
            divImejl.appendChild(inputImejl);

            let divPassword = document.createElement("div");
            divPassword.className = "labelaPassword";
            host.appendChild(divPassword);
            let labelaPassword = document.createElement("label");
            labelaPassword.innerHTML = "Password";
            let inputPassword = document.createElement("input");
            inputPassword.type = "text";
            divPassword.appendChild(labelaPassword);
            divPassword.appendChild(inputPassword);

            let divIme = document.createElement("div");
            divIme.className = "labelaIme";
            host.appendChild(divIme);
            let labelaIme = document.createElement("label");
            labelaIme.innerHTML = "Name";
            let inputIme = document.createElement("input");
            inputIme.type = "text";
            divIme.appendChild(labelaIme);
            divIme.appendChild(inputIme);

            let divPhone = document.createElement("div");
            divPhone.className = "labelaPhone";
            host.appendChild(divPhone);
            let labelaPhone = document.createElement("label");
            labelaPhone.innerHTML = "Phone";
            let inputPhone = document.createElement("input");
            inputPhone.type = "text";
            divPhone.appendChild(labelaPhone);
            divPhone.appendChild(inputPhone);

            let divAddress = document.createElement("div");
            divAddress.className = "labelaAddress";
            host.appendChild(divAddress);
            let labelaAddress = document.createElement("label");
            labelaAddress.innerHTML = "Address";
            let inputAddress = document.createElement("input");
            inputAddress.type = "text";
            divAddress.appendChild(labelaAddress);
            divAddress.appendChild(inputAddress);

            let divCity = document.createElement("div");
            divCity.className = "labelaCity";
            host.appendChild(divCity);
            let labelaCity = document.createElement("label");
            labelaCity.innerHTML = "City";
            let inputCity = document.createElement("input");
            inputCity.type = "text";
            divCity.appendChild(labelaCity);
            divCity.appendChild(inputCity);

            let divType = document.createElement("div");
            divType.className = "labelaType";
            host.appendChild(divType);
            let labelaType = document.createElement("label");
            labelaType.innerHTML = "Type";
            let inputType = document.createElement("select");
            let option1 = document.createElement("option");
            option1.innerHTML = "Muški";
            let option2 = document.createElement("option");
            option2.innerHTML = "Ženski";
            inputType.appendChild(option1);
            inputType.appendChild(option2);
            divType.appendChild(labelaType);
            divType.appendChild(inputType);

            let divTime = document.createElement("div");
            divTime.className = "labelaTime";
            host.appendChild(divTime);
            let labelaTime = document.createElement("label");
            labelaTime.innerHTML = "Working time";
            divTime.appendChild(labelaTime);

            let pocetak = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "ne radi"];
            let kraj = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "ne radi"];
            let dani = ["ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota", "nedelja"];


            dani.forEach(dan =>{
                let divDan = document.createElement("div");
                divDan.className = "labelaDan";
                host.appendChild(divDan);
                let labelaDan = document.createElement("label");
                labelaDan.innerHTML =dan;
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
                divDan.appendChild(labelaDan);
                divDan.appendChild(inputPocetak);
                divDan.appendChild(inputKraj);
                

                
            })

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
            
            dugme.onclick = () => {
                let niz2 = [];
                console.log(niz);
                for (let i = 0; i < 14; i=i+2) {
                    if(niz[i].value == "ne radi") {
                        niz2.push("ne radi");
                    }
                    else {
                        niz2.push(niz[i].value + "-" + niz[i+1].value)
                    }
                }

                
                let salon =  {
                    "email": inputImejl.value,
                    "password": inputPassword.value,
                    "name": inputIme.value,
                    "phone": inputPhone.value,
                    "address": inputAddress.value,
                    "city" : inputCity.value,
                    "tip" : inputType.value,
                    "workingTime" : niz2
                }
                if(inputImejl.value == "" || inputImejl.value == null || inputImejl.value == undefined) {
                    alert("Unesite imejl");
                    return;
                }
                if (inputPassword.value == "" || inputPassword.value == null || inputPassword.value == undefined) {
                    alert("Unesite password");
                    return;
                }
                if (inputIme.value == "" || inputIme.value == null || inputIme.value == undefined) {
                    alert("Unesite ime");
                    return;
                }
                if (inputPhone.value == "" || inputPhone.value == null || inputPhone.value == undefined) {
                    alert("Unesite broj telefona");
                    return;
                }
                if (inputAddress.value == "" || inputAddress.value == null || inputAddress.value == undefined) {
                    alert("Unesite adresu");
                    return;
                }
                if (inputCity.value == "" || inputCity.value == null || inputCity.value == undefined) {
                    alert("Unesite grad");
                    return;
                }
                fetch("http://localhost:5000/Salon/AddSalon",
                {
                    method:"POST",
                    headers:
                    {
                        "Accept": "application/json",
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(salon)
                }).then(r=>
                    {
                        if(r.status==200)
                        {
                            alert("Uspešna regstracija salona");
                            let divGlavni = document.querySelector(".registracija");
                            divGlavni.parentNode.removeChild(divGlavni);
                        }
                        else 
                            r.text().then(data => {
                                alert(data);
                            })
                    })
                
            }
        }
    }


}