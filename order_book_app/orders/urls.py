from django.urls import path

from orders import views


urlpatterns = [
    path('', views.get_orders, name="get_orders"),
    path('stocks/', views.get_available_stocks, name="get_available_stocks"),
    path('summary/<path:stock_name>/', views.get_orders_summary, name="get_orders_summary"),
    path('create/', views.create_order, name="create_order"),
    path('<int:order_id>/cancel/', views.cancel_order, name="cancel_order"),
    path('transactions/', views.get_transactions, name="get_transactions"),
]
