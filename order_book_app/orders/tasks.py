from celery import shared_task
from django.db import transaction
from django.db.models import Q
from django.db.utils import OperationalError

from orders.models import Order, OrderTransaction


@shared_task
def match_orders(stock_name):
    with transaction.atomic():
        print(f"Running match for {stock_name}")
        min_sell_order = (
            Order.objects
            .filter(stock_name=stock_name, order_type="SELL", status="PROCESSING")
            .order_by("price")
            .first()
        )
        if min_sell_order is None:
            print("No sell orders for this stock")
            return
        print(f"Found sell order for stock {stock_name}, id: {min_sell_order.id}")
        buy_order = (
            Order.objects
            .filter(
                ~Q(user_id=min_sell_order.user_id) &
                Q(stock_name=stock_name) &
                Q(order_type="BUY") &
                Q(status="PROCESSING") &
                Q(price__gte=min_sell_order.price)
            )
            .order_by("created_at")
            .first()
        )
        if buy_order is None:
            print("No buy orders for this price")
            return
        print(f"Found buy order for stock {stock_name}, id: {buy_order.id}")
        transaction_quantity = min(min_sell_order.quantity_remaining, buy_order.quantity_remaining)
        order_transaction = OrderTransaction(
            buy_order_id=buy_order.id,
            sell_order_id=min_sell_order.id,
            quantity=transaction_quantity
        )
        try:
            buy_order.quantity_remaining -= transaction_quantity
            if buy_order.quantity_remaining == 0:
                buy_order.status = "COMPLETED"
            min_sell_order.quantity_remaining -= transaction_quantity
            if min_sell_order.quantity_remaining == 0:
                min_sell_order.status = "COMPLETED"
            buy_order.save()
            min_sell_order.save()
            order_transaction.save()
        except OperationalError:
            # Concurent update here. Retry on next task call
            print("Concurent update")
    match_orders.delay(stock_name)
