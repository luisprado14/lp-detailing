const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzBa8VbCz3Pdpad3WswkKv3aSIB7k0SjAdmpxhaLeDrOaRScMJuD1OSYMUtwERsVYE/exec";

const form = document.getElementById("formMarcacao");
const campoData = document.getElementById("data");
const campoHora = document.getElementById("hora");
const botaoTopo = document.getElementById("topo");

campoData.addEventListener("change", carregarHoras);

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        botaoTopo.style.display = "block";
    } else {
        botaoTopo.style.display = "none";
    }

});

botaoTopo.addEventListener("click", () => {

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

});

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const dados = {

        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        localidade: document.getElementById("localidade").value,
        servico: document.getElementById("servico").value,
        veiculo: document.getElementById("veiculo").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        observacoes: document.getElementById("observacoes").value

    };

    try{

        const resposta = await fetch(URL_SCRIPT,{
    method:"POST",
    body:JSON.stringify(dados)
});

        const resultado = await resposta.json();

        if(resultado.sucesso){

            alert("✅ Marcação efetuada com sucesso!");

            form.reset();

            campoHora.innerHTML =
            '<option value="">Escolha a Hora</option>';

        }else{

            alert("Erro ao gravar.");

        }

    }catch(erro){

        console.error(erro);

        alert("Erro de ligação ao servidor.");

    }

});

async function carregarHoras(){

    const data = campoData.value;

    if(!data) return;

    try{

        const resposta = await fetch(
            URL_SCRIPT + "?data=" + encodeURIComponent(data)
        );

        const ocupadas = await resposta.json();

        const horas = [

            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00"

        ];

        campoHora.innerHTML =
        '<option value="">Escolha a Hora</option>';

        horas.forEach(hora=>{

            if(!ocupadas.includes(hora)){

                campoHora.innerHTML +=
                `<option value="${hora}">${hora}</option>`;

            }

        });

    }catch(erro){

        console.error(erro);

    }

}