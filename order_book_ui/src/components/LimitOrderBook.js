import './LimitOrderBook.css'
import React, { useState, useEffect, useLayoutEffect, useMemo, useInsertionEffect } from 'react';
import OrderItem from "../components/OrderItem";
import api from "../api"

const LimitOrderBook= () => {
    const [stockNames, setStockNames] = useState([]);
    const [sellOrdersData, setSellOrdersData] = useState([])
    const [buyOrdersData, setBuyOrdersData] = useState([])

    console.log("Rendering")

    const fetchOrdersBookData = (stockName) => {
        if (stockName === "") {
            console.log("Blank stock name");
            return;
        }
        api.get(
            `/orders/summary/${stockName}/`)
            .then(response => {
                setBuyOrdersData(response.data.filter(element => element.orderType === "BUY"))
                setSellOrdersData(response.data.filter(element => element.orderType === "SELL"))
            })
            .catch((error) => {console.log(error)});
    }

    useEffect( () => {
        console.log("Call Stocks Names")
        api.get("/orders/stocks/")
            .then(response => {
                setStockNames(response.data)
            })
            .catch((error) => {console.log(error)});

    }, []);

    useEffect(() => {
        if (stockNames.length !== 0) {
            fetchOrdersBookData(stockNames[0].stockName)
        }
    }, [stockNames])

    console.log(buyOrdersData)
    console.log(sellOrdersData)

    return (
        <div className="LimitOrderBook">
            <h1>Limit Order Book</h1>
            <select name="stockName" onChange={(e) => fetchOrdersBookData(e.target.value)}>
                {stockNames.map(item => (
                    <option key={item.stockName} value={item.stockName}>{ item.stockName }</option>
                ))}
            </select>
            <table className="tableWithBorders">
                <thead>
                    <tr>
                        <td></td>
                        <td className="orderTypeCell">Quantity</td>
                        <td className="orderTypeCell">Price</td>
                    </tr>
                </thead>
                <tbody>
                {buyOrdersData.map((item, index) => (
                    <tr className="OrderBookItem" key={index}>
                        {index === 0 &&
                            <td className="orderTypeCell" rowSpan={buyOrdersData.length} value={index}>{ item.orderType }</td>
                        }
                        <td>{ item.quantity }</td>
                        <td>{ item.price }</td>
                    </tr>
                ))}
                {sellOrdersData.map((item, index) => (
                    <tr key={index} className="OrderBookItem">
                        {index === 0 &&
                            <td className="orderTypeCell" rowSpan={sellOrdersData.length} value={index}>{ item.orderType }</td>
                        }
                        <td>{ item.quantity }</td>
                        <td>{ item.price }</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default LimitOrderBook;
