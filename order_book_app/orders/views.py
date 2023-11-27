from django.db.models import Sum, Q
from django.db.utils import OperationalError
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from orders.models import Order, OrderTransaction
from orders.serializers import (
    OrderSummaryResponseSerializer,
    OrderCreateRequestSerializer,
    OrderResponseSerializer,
    OrderTransactionResponseSerializer,
    StockResponseSerializer,
)
from orders import tasks


@swagger_auto_schema(
    method="GET",
    responses={
        status.HTTP_200_OK: OrderSummaryResponseSerializer(many=True)
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders_summary(request, stock_name):
    query = (
        Order.objects
        .filter(
            status="PROCESSING",
            stock_name=stock_name
        ).values("price", "order_type").annotate(
            quantity=Sum("quantity_remaining")
        ).order_by("order_type", "-price")
    )
    serializer = OrderSummaryResponseSerializer(query, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method="GET",
    responses={
        status.HTTP_200_OK: StockResponseSerializer(many=True),

    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_stocks(request):
    query = Order.objects.order_by("stock_name").values("stock_name").distinct()
    serializer = StockResponseSerializer(query, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method="GET",
    responses={
        status.HTTP_200_OK: OrderResponseSerializer(many=True)
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    query = Order.objects.filter(user_id=request.user.id)
    serializer = OrderResponseSerializer(query, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method="GET",
    responses={
        status.HTTP_200_OK: OrderTransactionResponseSerializer(many=True)
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    query = (
        OrderTransaction.objects
        .select_related("buy_order__user", "sell_order__user")
        .filter(Q(
            Q(buy_order__user_id=request.user.id) | Q(sell_order__user_id=request.user.id)
        ))
    )
    serializer = OrderTransactionResponseSerializer(query, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    method="POST",
    request_body=OrderCreateRequestSerializer,
    responses={
        status.HTTP_201_CREATED: OrderResponseSerializer
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = OrderCreateRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.validated_data["user_id"] = request.user.id
    order = serializer.save()
    serializer = OrderResponseSerializer(order)
    tasks.match_orders.delay(order.stock_name)
    return Response(serializer.data)


@swagger_auto_schema(
    method="PUT",
    responses={
        status.HTTP_200_OK: OrderResponseSerializer
    }
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if order.status != "PROCESSING":
        return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    try:
        order.status = "CANCELED"
        order.save()
    except OperationalError:
        return Response(status=status.HTTP_409_CONFLICT)
    serializer = OrderResponseSerializer(order)
    return Response(serializer.data)
