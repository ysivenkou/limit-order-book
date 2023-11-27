import "./OrderList.css"
import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import OrderItem from "../components/OrderItem";
import api from "../api"

const OrderList = () => {
    const [ordersData, setOrdersData] = useState([]);

    useEffect( () => {
        api.get("/orders/")
            .then(response => setOrdersData(response.data))
            .catch((error) => {
                console.log(error)
            });

    }, []);
    console.log(ordersData)

    return (
        <div className="OrderList">
            <div className="orderListHeader">
                <h1>My Orders</h1>
                <Link className="createOrderButton" to="/orders/create">Create Order</Link>
            </div>

            <table className="simpleTable">
                <thead>
                    <tr style={{ backgroundColor: "#F3F3F3"}}>
                        <th>Order Type</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Processed / Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {ordersData.map((item, index) => (
                    <OrderItem {...item}></OrderItem>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrderList;
