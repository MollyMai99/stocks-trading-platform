import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchStockDetails, buyStock } from "../utilities/stocks-service";
import { getUser } from "../utilities/users-service";

export default function StockDetailPage() {
  const { stockId } = useParams();
  const { state } = useLocation();
  const { stockCode } = state; // 从 state 获取 stockCode
  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState("");
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    async function fetchStockDetailsFromAPI() {
      try {
        const stockData = await fetchStockDetails(stockCode); // 从API获取股票详情
        setStock(stockData);
      } catch (err) {
        setError("Failed to fetch stock details");
      }
    }
    fetchStockDetailsFromAPI();
  }, [stockCode]);

  const handleBuyClick = () => {
    setShowBuyOptions(true);
  };

  const handleBuyStock = async () => {
    try {
      console.log("Initiating buyStock with user.id:", user.id);
      await buyStock(stockId, quantity, stock.price, user.id);
      navigate("/transactions");
    } catch (err) {
      console.error("Error occurred while buying stock:", err);
      if (err.message.includes("User not approved")) {
        setError(
          "You are not approved to buy stocks. Please wait for admin approval."
        );
      } else {
        setError("Failed to buy stock");
      }
    }
  };

  if (!stock) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{stock.ticker} Details</h1>
      <p>Company: {stock.name}</p>
      <p>Stock Code: {stock.ticker}</p>
      <p>Price: {stock.price}</p>

      {/* <h1>{stock.stock_name} Details</h1>
      <p>Company: {stock.company_name}</p>
      <p>Stock Code: {stock.stock_code}</p>
      <p>Price: {stock.current_price}</p> */}

      {/* <Link to={`/buy/${stock.id}`}>
        <button>Buy Stock</button>
      </Link> */}
      {!showBuyOptions && <button onClick={handleBuyClick}>Buy Stock</button>}
      {showBuyOptions && (
        <>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <p>Total Cost: {quantity * stock.price}</p>
          <button onClick={handleBuyStock}>Confirm Purchase</button>
          {error && <p>{error}</p>}
        </>
      )}
    </div>
  );
}
