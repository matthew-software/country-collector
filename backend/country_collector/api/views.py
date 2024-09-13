from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CountrySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Country


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