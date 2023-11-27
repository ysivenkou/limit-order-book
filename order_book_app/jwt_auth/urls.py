from django.urls import path

from jwt_auth.views import (
    DecoratedTokenObtainPairView,
    DecoratedTokenRefreshView,
)

urlpatterns = [
    path('', DecoratedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', DecoratedTokenRefreshView.as_view(), name='token_refresh'),
]
