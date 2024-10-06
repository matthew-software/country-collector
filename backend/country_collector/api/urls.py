from django.urls import path, include
from api.views import UserDetailView, CreateUserView, AllCountriesView, CollectedCountryCodesView, CheckCountryGuessView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("user/", UserDetailView.as_view(), name="user-detail"),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('all-countries/', AllCountriesView.as_view(), name='all-countries'),
    path('collected-country-codes/', CollectedCountryCodesView.as_view(), name='collected-country-codes'),
    path('check-country-guess/', CheckCountryGuessView.as_view(), name='check-country-guess'),
]

