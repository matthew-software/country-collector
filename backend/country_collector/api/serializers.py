from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Country, UserCountry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['country_name', 'capital', 'flag_url']


class UserCountrySerializer(serializers.ModelSerializer):
    country = CountrySerializer()

    class Meta:
        model = UserCountry
        fields = ['user', 'country', 'collected', 'collected_date']