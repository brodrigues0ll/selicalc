import { useEffect, useState } from 'react';
import './App.css';
import NumberFormat from 'react-number-format';

function App() {
  const [stringRes, setApiResponse] = useState();
  const [valorAplicado, setValorAplicado] = useState(undefined);

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

  //Cálculos
  const taxaSelic = parseFloat(stringRes);
  const dinheiroInvestido = parseFloat(valorAplicado);

  const ResultadoBruto = (dinheiroInvestido + ( (taxaSelic / 100) * dinheiroInvestido ) - dinheiroInvestido) / 12;

  const moneyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return (
    <div className="App">
      <h1>Cálculo de Rendimento Selic</h1>
      <p>A taxa selic hoje é de {stringRes}% ao ano</p>

      <label htmlFor="valor_aplicado">
        Valor a ser Aplicado:
        {' '}
        <NumberFormat
          thousandSeparator={'.'}
          prefix={'R$ '}
          decimalSeparator={','}
          onChange={event => setValorAplicado(event.target.value.replace(/[^0-9]/g, ''))}
        />
      </label>

      {valorAplicado === '' || valorAplicado === undefined
        ? <p>{moneyFormatter.format('000')} por mês </p>
        : <p>{moneyFormatter.format(ResultadoBruto.toFixed(2))} por mês</p>}
    </div>
  );
}

export default App;
