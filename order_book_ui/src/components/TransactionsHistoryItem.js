const TransactionsHistoryItem = ({id, seller, buyer, stockName, price, quantity, createdAt}) => {
    return (
        <tr key={id} className="TransactionsHistoryItem">
            <td>{ seller }</td>
            <td>{ buyer }</td>
            <td>{ stockName }</td>
            <td>{ price }</td>
            <td>{ quantity }</td>
            <td>{ createdAt }</td>
        </tr>
    )
}

export default TransactionsHistoryItem;
