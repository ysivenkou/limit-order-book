import './OrderItem.css'
import api from "../api";

const OrderItem = ({id, orderType, stockName, price, quantityTotal, quantityRemaining, orderStatus, createdAt}) => {
    const cancelOrder = (id) => {
        api.put(`/orders/${id}/cancel/`)
            .then(() => {
                // setComponentOrderStatus("CANCELED")
            })
            .catch((error) =>{
                console.log("Error")
            })
    }

    return (
        <tr key={id} className="OrderItem">
            <td>{ orderType }</td>
            <td>{ stockName }</td>
            <td>{ price }</td>
            <td>{ quantityTotal - quantityRemaining } / { quantityTotal }</td>
            <td>{ orderStatus }</td>
            <td>{ createdAt }</td>
            <td>
                {orderStatus === "PROCESSING" && <div className="cancelOrderButton">x</div> }
            </td>
        </tr>
    )
}

export default OrderItem;
