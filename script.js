const api = 'https://pokeapi.co/api/v2/pokemon/';
const campoPesquisa = document.getElementById('campo-pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');
const mensagemErro = document.getElementById('mensagem-erro');
const imgNormal = document.getElementById('img-normal-pokemon');
const imgShiny = document.getElementById('img-shiny-pokemon');
const pokemonNumero = document.getElementById('pokemon-numero');
const pokemonNome = document.getElementById('pokemon-nome');
const pokemonTipagem = document.getElementById('pokemon-tipagem');
const pokemonPeso = document.getElementById('pokemon-peso');
const pokemonAltura = document.getElementById("pokemon-altura");
const listaStats = document.getElementById('lista-stats');
const botaoAnterior = document.getElementById('botao-anterior');
const botaoProximo = document.getElementById('botao-proximo');
const idMinimo = 1;
const idMaximo = 10286;
let idAtual = null;
let cry = null;

async function buscarPokemon(buscar)
{
    const resposta = await fetch(api + buscar);

    if (!resposta.ok) {
        throw new Error("Pokémon não encontrado");
    }

    const infoPokemon = await resposta.json();
    return infoPokemon;
}

function exibirPokemon(info)
{
    idAtual = info.id;
    pokemonNumero.textContent = info.id;
    pokemonNome.textContent = capitalizarNome(info.name);
    pokemonTipagem.textContent = info.types.map(function (item)
    {
        return capitalizarNome(item.type.name);
    }).join(", ");
    imgNormal.src = info.sprites.other.showdown.front_default;
    imgShiny.src = info.sprites.other.showdown.front_shiny;
    cry = info.cries.latest;
    pokemonPeso.textContent = converterPeso(info.weight) + " kg";
    pokemonAltura.textContent = converterAltura(info.height) + " m";
    exibirStats(info.stats);
}

function exibirStats(arrayStats)
{
    listaStats.innerHTML = "";
    arrayStats.forEach(function (item) {
        const linha = document.createElement("li");
        linha.textContent = item.stat.name + ": " + item.base_stat;
        listaStats.appendChild(linha);
    });
}

function exibirErro(mensagem)
{
    mensagemErro.textContent = mensagem;
}

function converterPeso(pesoHectogramas)
{
    return pesoHectogramas / 10;
}

function converterAltura(alturaDecimetros)
{
    return alturaDecimetros / 10;
}

function capitalizarNome(pokemonNome)
{
    return pokemonNome.charAt(0).toUpperCase() + pokemonNome.slice(1);
}

async function carregarPokemon(consulta)
{
    try {
        const dados = await buscarPokemon(consulta);

        exibirErro('');
        exibirPokemon(dados);

    } catch (erro) {
        exibirErro(erro.message || 'Erro ao buscar o Pokémon');
    }
}

function pesquisar()
{
    const texto = campoPesquisa.value.trim().toLowerCase();
    if (texto === "") {
        exibirErro("Digite o número ou o nome de um Pokémon");
        return;
    }
    carregarPokemon(texto);
}

function proximoPokemon()
{
    if (idAtual !== null && idAtual < idMaximo) {
        carregarPokemon(idAtual + 1);
    }
}

function pokemonAnterior()
{
    if (idAtual !== null && idAtual > idMinimo) {
        carregarPokemon(idAtual - 1);
    }
}

botaoPesquisa.addEventListener("click", pesquisar);
campoPesquisa.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter")
    {
        pesquisar();
    }
});
botaoProximo.addEventListener("click", proximoPokemon);
botaoAnterior.addEventListener("click", pokemonAnterior);

function reproduzirCry()
{
    if(cry !== null)
    {
        const audio = new Audio(cry);
        audio.volume = 0.3;
        audio.play();
    }
}

imgNormal.addEventListener('click', reproduzirCry);
imgShiny.addEventListener('click', reproduzirCry);

carregarPokemon(idMinimo);