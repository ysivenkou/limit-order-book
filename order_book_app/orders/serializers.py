from rest_framework import serializers

from orders.models import Order, OrderTransaction


class OrderSummaryResponseSerializer(serializers.ModelSerializer):
    quantity = serializers.DecimalField(max_digits=16, decimal_places=2)
    orderType = serializers.CharField(max_length=5, source="order_type")

    class Meta:
        model = Order
        fields = ("price", "orderType", "quantity")


class OrderCreateRequestSerializer(serializers.ModelSerializer):
    orderType = serializers.CharField(max_length=5, source="order_type")
    stockName = serializers.CharField(max_length=4, source="stock_name")
    quantity = serializers.IntegerField(source="quantity_total")

    class Meta:
        model = Order
        fields = ('orderType', 'stockName', 'price', 'quantity')

    def save(self, **kwargs):
        self.validated_data["quantity_remaining"] = self.validated_data["quantity_total"]
        return super().save(**kwargs)


class OrderResponseSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(source="id")
    stockName = serializers.CharField(max_length=4, source="stock_name")
    # price = serializers.DecimalField(decimal_places=2, max_digits=16, source="price")
    orderType = serializers.CharField(max_length=5, source="order_type")
    createdAt = serializers.DateTimeField(source="created_at")
    quantityTotal = serializers.IntegerField(source="quantity_total")
    quantityRemaining = serializers.IntegerField(source="quantity_remaining")
    orderStatus = serializers.CharField(max_length=10, source="status")

    class Meta:
        model = Order
        fields = (
            "id", "stockName", "price", "orderType", "createdAt", "quantityTotal", "quantityRemaining", "orderStatus"
        )


class OrderTransactionResponseSerializer(serializers.ModelSerializer):
    seller = serializers.CharField(max_length=150, source="sell_order.user.username")
    buyer = serializers.CharField(max_length=150, source="buy_order.user.username")
    stockName = serializers.CharField(max_length=4, source="sell_order.stock_name")
    price = serializers.DecimalField(max_digits=16, decimal_places=2, source="sell_order.price")
    createdAt = serializers.DateTimeField(source="created_at")

    class Meta:
        model = OrderTransaction
        fields = ("id", "seller", "buyer", "stockName", "price", "quantity", "createdAt")


class StockResponseSerializer(serializers.ModelSerializer):
    stockName = serializers.CharField(max_length=4, source="stock_name")

    class Meta:
        model = Order
        fields = ("stockName",)
