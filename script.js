const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzBa8VbCz3Pdpad3WswkKv3aSIB7k0SjAdmpxhaLeDrOaRScMJuD1OSYMUtwERsVYE/exec";

const form = document.getElementById("formMarcacao");
const campoData = document.getElementById("data");
// Impede datas passadas
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

campoData.min = `${ano}-${mes}-${dia}`;

// Impede domingos
campoData.addEventListener("input", function () {

    const data = new Date(this.value);

    if (data.getDay() === 0) {

        alert("Não efetuamos marcações aos domingos.");

        this.value = "";

    }

});
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

        const botao = document.querySelector("button[type='submit']");

botao.disabled = true;
botao.textContent = "A enviar...";

const resposta = await fetch(URL_SCRIPT,{
    method:"POST",
    body:JSON.stringify(dados)
});

botao.disabled = false;
botao.textContent = "Marcar Agora";

        const resultado = await resposta.json();

        if(resultado.sucesso){

            document.getElementById("mensagem").style.display = "flex";
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
const servico = document.getElementById("servico");
const veiculo = document.getElementById("veiculo");
const extra = document.getElementById("extra");

servico.addEventListener("change", atualizarCampos);

function atualizarCampos() {

    const valor = servico.value;

    veiculo.style.display = "block";
    veiculo.required = true;

    extra.style.display = "none";
    extra.required = false;
    extra.innerHTML = "";

    if (valor === "Limpeza de Sofás") {

        veiculo.style.display = "none";
        veiculo.required = false;
        veiculo.value = "";

        extra.style.display = "block";
        extra.required = true;

        extra.innerHTML = `
            <option value="">N.º de Lugares</option>
            <option>1 Lugar</option>
            <option>2 Lugares</option>
            <option>3 Lugares</option>
            <option>4 Lugares</option>
            <option>Chaise Longue</option>
            <option>Canto</option>
        `;

    }

    else if (valor === "Limpeza de Colchões") {

        veiculo.style.display = "none";
        veiculo.required = false;
        veiculo.value = "";

        extra.style.display = "block";
        extra.required = true;

        extra.innerHTML = `
            <option value="">Tamanho do Colchão</option>
            <option>Solteiro</option>
            <option>Casal</option>
            <option>Queen</option>
            <option>King</option>
        `;

    }

}
function fecharMensagem(){

    document.getElementById("mensagem").style.display="none";

}
