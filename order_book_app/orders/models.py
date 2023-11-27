from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ("SELL", "SELL", ),
        ("BUY", "BUY", ),
    ]

    STATUS_CHOICES = [
        ("CANCELED", "CANCELED", ),
        ("COMPLETED", "COMPLETED", ),
        ("PROCESSING", "PROCESSING", ),
    ]

    stock_name = models.CharField(max_length=4)
    price = models.DecimalField(decimal_places=2, max_digits=16)
    order_type = models.CharField(choices=ORDER_TYPE_CHOICES, max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    quantity_total = models.IntegerField()
    quantity_remaining = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PROCESSING")
    user = models.ForeignKey(User, on_delete=models.RESTRICT)


class OrderTransaction(models.Model):
    buy_order = models.ForeignKey(
        Order,
        on_delete=models.RESTRICT,
        null=True,
        related_name="source_transactions"
    )
    sell_order = models.ForeignKey(
        Order,
        on_delete=models.RESTRICT,
        null=True,
        related_name="target_transactions"
    )
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
