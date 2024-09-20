from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CountrySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Country, UserCountry
from rest_framework.views import APIView
from rest_framework.response import Response


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CountryListCreate(generics.ListCreateAPIView):
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Country.objects.filter()


class CollectedCountriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        collected_countries = UserCountry.objects.filter(user=user).values_list('country__country_code', flat=True)
        return Response({
            #'collected_countries': list(collected_countries)
            'collected_countries': ['US', 'FR', 'CN']
        })