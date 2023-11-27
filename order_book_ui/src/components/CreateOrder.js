import './CreateOrder.css'
import React, {useState} from "react";
import api from "../api"

const CreateOrder = () => {

    const [orderData, setOrderData] = useState({
        orderType: "SELL",
        stockName: "",
        price: null,
        quantity: null
    })
    const [errorMessage, setErrorMessage] = useState("")

    console.log(orderData)

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/orders/create/', orderData)
            .then(() => {
                setErrorMessage("");
                window.location.href = "/orders/";
            })
            .catch((error) =>{
                setErrorMessage("Invalid data")
            })
    }

    const handleChange = (e) => {
        setOrderData({
            ...orderData,
            [e.target.name]: e.target.value
        });
    }

    console.log(orderData)

    return (
        <div className="CreateOrder">
            <h1>Create Order</h1>
            <form className="CreateOrderForm" onSubmit={handleSubmit}>
                <div className="input-field">
                    <label for="orderType">Order Type</label>
                    <select name="orderType" value={orderData.orderType} onChange={handleChange}>
                        <option key="SELL" value="SELL">SELL</option>
                        <option key="BUY" value="BUY">BUY</option>
                    </select>
                </div>
                <div className="input-field">
                    <label for="stockName">Stock Name</label>
                    <input
                        type="text"
                        name="stockName"
                        placeholder="Stock Name"
                        value={orderData.stockName}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-field">
                    <label for="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        pattern="^\d*(\.\d{0,2})?$"
                        value={orderData.price}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="1"
                        pattern="^\d*(\.\d{0,2})?$"
                        value={orderData.quantity}
                        min="1"
                        onChange={handleChange}
                    />
                </div>
                <p>{errorMessage && errorMessage}</p>
                <button className="submitOrderButton" type="submit" onSubmit={handleSubmit}>Create</button>
            </form>
        </div>
    )
}

export default CreateOrder;