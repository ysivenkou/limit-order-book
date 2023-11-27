import React, { useState, useEffect } from 'react';
import TransactionsHistoryItem from "./TransactionsHistoryItem";
import api from "../api"

const TransactionsHistory = () => {
    const [transactionsData, setTransactionsData] = useState([]);

    useEffect( () => {
        api.get("http://127.0.0.1:8000/api/orders/transactions/")
            .then(response => setTransactionsData(response.data))
            .catch((error) => {console.log(error)});

    }, []);
    console.log(transactionsData)

    return (
        <div className="TransactionsHistory">
            <h1>Transactions History</h1>
            <table className="simpleTable">
                <thead>
                    <tr>
                        <th>Seller</th>
                        <th>Buyer</th>
                        <th>Stock Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                {transactionsData.map(item => (
                    <TransactionsHistoryItem {...item}></TransactionsHistoryItem>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default TransactionsHistory;
