import { useEffect, useState } from "react";
import "./styles.css";
import pokeball from './Icons/pokeball.png';
import bolt from './Icons/bolt.png';
import Swal from 'sweetalert2';

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [getError, setError] = useState(null);
  const [page, setPage] = useState("Todos");

  function loadPokedex() {
    if (JSON.parse(localStorage.getItem("capturados")) === null) {
      localStorage.setItem("capturados", '[]');
    }
  }

  function addPokemon(e) {
    const date = new Date();
    e.captureTime = date.toLocaleDateString("pt-BR", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    var readableSession = JSON.parse(localStorage.getItem("capturados"));
    readableSession.push(e)
    localStorage.setItem("capturados", JSON.stringify(readableSession));
  }

  function loadPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=9999")
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Ops! Houve um erro em nosso servidor.');
      }
    })
    .then(response => {
      setPokemon(response.results)
    }).catch(err => {
      setError(err.toString())
    });
  }

  function capture(e) {
    Swal.fire({
      title: 'Confirmar captura de ' + e.name.slice(0,1).toUpperCase() + e.name.slice(1) +'?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim, eu capturei!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        addPokemon(e);
        setPage("Capturados")
        Swal.fire(
          'Confirmado!',
          'Seu '+ e.name.slice(0,1).toUpperCase() + e.name.slice(1) + ' foi adicionado à sua lista de capturados da Pokedéx.',
          'success'
        )
      }
    })
  }

  async function showPowers(e) {
    fetch(e.url)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Ops! Houve um erro em nosso servidor.');
      }
    })
    .then(response => {
      console.log(response.abilities);
      Swal.fire({title: 'Lista de ataques de ' + e.name.slice(0,1).toUpperCase() + e.name.slice(1),
      html: '<ol>'+response.abilities.map((e) => '<li>' + e.ability.name + '</li>')+'</ol>'
    })
    }).catch(() => {
      return false;
    });
  }

  function renderPage() {
    switch(page) {
      case "Todos":
        return <div className="VisorInner">
          {getError !== null
          ? getError
          : pokemon.map((e, index) => {
            return <p key={index}>
              {e.name.slice(0,1).toUpperCase() + e.name.slice(1)}
              <img onClick={() => capture(e)} alt="" src={pokeball} height="16px" />
              </p>
          })}
        </div>
      case "Capturados":
        return <div className="VisorInner">
        {   JSON.parse(localStorage.getItem("capturados")) 
         && JSON.parse(localStorage.getItem("capturados")).map((e, index) => {
            return <p key={index}>
            {e.name.slice(0,1).toUpperCase() + e.name.slice(1)} capturado em {e.captureTime.split(" ")[0]} às {e.captureTime.split(" ")[1]}
            <img style={{border: '1px solid black', borderRadius: '100%', filter: 'invert(1)'}} onClick={() => showPowers(e)} alt="" src={bolt} height="16px" />
          </p>
          })}
      </div>
      default: 
          return <div>Erro</div>
    }
  }

  useEffect(() => {
    loadPokemon();
    loadPokedex();
  }, []);

  return (
    <div className="App">
      <div className="PokedexBody">
        <div className="PokedexUpperBody">
          <div className="Lens"> </div>
          <div className="Red Light"> </div>
          <div className="Yellow Light"> </div>
          <div className="Cyan Light"> </div>
        </div>
        <div className="WeirdDivider">
          <div className="Piece-1"> </div>
          <div className="Piece-2"> </div>
          <div className="Piece-3"> </div>
        </div>
        <div className="VisorOuter">
          {renderPage()}
          <div className="ButtonWrapper">
            <button className={page === "Todos" ? "Active" : "Inactive"} onClick={() => setPage("Todos")}>Todos</button>
            <button className={page === "Capturados" ? "Active" : "Inactive"} onClick={() => setPage("Capturados")}>Capturados</button>
          </div>
        </div>
    </div>
    </div>
  );
}
