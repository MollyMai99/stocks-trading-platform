import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks } from "../utilities/stocks-service";

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchStocks() {
      const stocksData = await getStocks();
      setStocks(stocksData);
      // console.log(stocks);
    }
    fetchStocks();
  }, []);

  return (
    <div>
      <h1>Stock Market</h1>
      <table>
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Company Name</th>
            <th>Stock Code</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.stock_name}</td>
              <td>{stock.company_name}</td>
              <td>{stock.stock_code}</td>
              <td>
                <Link to={`/stocks/${stock.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}