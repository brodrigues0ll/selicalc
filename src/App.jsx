import { useEffect, useState } from 'react';
import './App.css';
import NumberFormat from 'react-number-format';
import moment from 'moment';

function App() {
  const [stringRes, setApiResponse] = useState();
  const [valorAplicado, setValorAplicado] = useState(undefined);
  const [aplicationDate, setAplicationDate] = useState();
  const [resgateDate, setResgateDate] = useState();

  useEffect(() => {
    async function getDataFromApi() {
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json');
      const apiResponse = await response.json();

      setApiResponse(apiResponse.slice(-1)[0].valor);
      // console.log((apiResponse.slice(-1)));

    }
    getDataFromApi();
  }, []);

  //Cálculos
  const taxaSelic = parseFloat(stringRes);
  const dinheiroInvestido = parseFloat(valorAplicado);

  const ResultadoBruto = (dinheiroInvestido + ((taxaSelic / 100) * dinheiroInvestido) - dinheiroInvestido) / 12;

  const dias = moment(resgateDate, "YYYY-MM-DD").diff(moment(aplicationDate, "YYYY-MM-DD"), "days");

  function subtraiTaxa() {
    if (dias <= 180) {
      return (22.5 / 100) * ResultadoBruto;
    }
    else if (dias > 180 && dias <= 364) {
      return (20 / 100) * ResultadoBruto;
    }
    else if (dias > 364 && dias <= 720) {
      return (17.5 / 100) * ResultadoBruto;
    }
    else if (dias > 720) {
      return (15 / 100) * ResultadoBruto;
    }
  }

  const moneyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return (
    <div className="App">
      <h1>Cálculo de Rendimento Selic</h1>
      <p>A taxa selic hoje é de {stringRes}% ao ano</p>

      <label htmlFor="">
        Data da aplicação:
        {' '}
        <input type="date" onChange={event => setAplicationDate(event.target.value)} />
      </label>

      <label htmlFor="">
        Data do Resgate:
        {' '}
        <input type="date" onChange={event => setResgateDate(event.target.value)} />
      </label>

      <label htmlFor="valor_aplicado">
        Valor a ser Aplicado:
        {' '}
        <NumberFormat
          style={{ width: "100px" }}
          thousandSeparator={'.'}
          prefix={'R$ '}
          decimalSeparator={','}
          onChange={event => setValorAplicado(event.target.value.replace(/[^0-9]/g, ''))}
        />
      </label>

      {valorAplicado === '' || valorAplicado === undefined
        ? <p>{moneyFormatter.format('000')} por mês </p>
        : <p>{moneyFormatter.format(ResultadoBruto - subtraiTaxa())} por mês</p>}

      {/* {dias <= 1 || isNaN(dias)
        ? <p style={{ fontWeight: "bold" }}>{''}</p>
        : <p style={{ fontWeight: "bold" }}>{`Passaram ${dias} dias`}</p>} */}
    </div >
  );
}

export default App;
