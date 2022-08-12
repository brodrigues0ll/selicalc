import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [stringRes, setApiResponse] = useState();
  const [valorAplicado, setValorAplicado] = useState('');

  useEffect(() => {
    async function getDataFromApi() {
      const response = await fetch(
        'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json'
      );
      const apiResponse = await response.json();

      setApiResponse(apiResponse.slice(-1)[0].valor);
      // console.log((apiResponse.slice(-1)));

    }
    getDataFromApi();
  }, []);

  const floatRes = parseFloat(stringRes);
  const floatValApl = parseFloat(valorAplicado);

  return (
    <div className="App">
      <h1>Cáuculo de Rendimento Selic</h1>
      <p>A taxa selic hoje é de {stringRes}% ao ano</p>

      <label htmlFor="valor_aplicacao">
        Valor a ser Aplicado:
        {' '}
        <input
          type="number"
          min="0.00"
          max="10000.00"
          step="0.01"
          onChange={event => setValorAplicado(event.target.value)}
        />
      </label>

      { valorAplicado === ''
        ? ''
        : <p>R${ (((floatValApl + (floatRes/100*floatValApl)) - floatValApl) / 12).toFixed(2) } por mês</p> }

    </div>
  );
}

export default App;
