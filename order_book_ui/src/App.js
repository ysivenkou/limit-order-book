import './App.css';
import Login from "./components/Login";
import OrderList from "./components/OrderList"
import Layout from "./components/Layout";
import LimitOrderBook from "./components/LimitOrderBook";
import TransactionsHistory from "./components/TransactionsHistory";
import CreateOrder from "./components/CreateOrder";

import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<LimitOrderBook/>}/>
                        <Route path="/orders" element={<OrderList/>}/>
                        <Route path="/transactions" element={<TransactionsHistory/>}></Route>
                        <Route path="/orders/create" element={<CreateOrder/>}></Route>
                    </Route>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </BrowserRouter>
            {/*<Layout />*/}
        </div>
    );
}

export default App;
