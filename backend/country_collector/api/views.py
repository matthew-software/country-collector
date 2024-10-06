from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Country, UserCountry
from .serializers import UserSerializer, CountrySerializer
from django.utils import timezone
import re


# View for creating users (remains the same)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# View to return the current authenticated user's username
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'username': user.username})


# View to provide all country data
class AllCountriesView(APIView):
    permission_classes = [AllowAny]  # No authentication required to fetch all country data

    def get(self, request):
        # Fetch all countries from the database
        all_countries = Country.objects.all()
        # Serialize the country data
        countries_info = CountrySerializer(all_countries, many=True).data
        # Return the serialized data as a response
        return Response({'countries': countries_info})


# View to provide a list of country codes that a particular user has collected
class CollectedCountryCodesView(APIView):
    permission_classes = [IsAuthenticated]  # Authentication required

    def get(self, request):
        # Get the current authenticated user
        user = request.user
        # Fetch the collected country codes for this user
        collected_country_codes = UserCountry.objects.filter(user=user, collected=True).values_list('country__country_code', flat=True)
        # Convert the queryset to a list and return it
        return Response({'collected_country_codes': list(collected_country_codes)})
    
        # Hardcode for testing:
        #return Response({'collected_country_codes': ['US', 'CA', 'FR']})


class CheckCountryGuessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        clicked_country = request.data.get('clickedCountry')
        country_name = request.data.get('countryName', '')
        capital_name = request.data.get('capitalName', '')
        selected_flag = request.data.get('selectedFlag', '')

        # Function to normalize strings (remove spaces, punctuation, and make lowercase)
        def normalize_string(input_string):
            if input_string is None:
                return ''
            return re.sub(r'\W+', '', input_string).lower()  # \W+ matches any non-word character (punctuation, spaces, etc.)

        # Normalize user input
        normalized_clicked_country = normalize_string(clicked_country)
        normalized_country_name = normalize_string(country_name)
        normalized_capital_name = normalize_string(capital_name)
        normalized_flag = normalize_string(selected_flag)

        try:
            # Normalize country fields before querying the database
            countries = Country.objects.all()
            for country in countries:
                normalized_db_country_name = normalize_string(country.country_name)
                normalized_db_capital_name = normalize_string(country.capital) if country.capital else ''
                normalized_db_flag = normalize_string(country.country_code)  # Assuming country_code is used for flags

                # If the country's capital is NULL, ignore the capital check
                if (
                    normalized_clicked_country == normalized_country_name and
                    normalized_country_name == normalized_db_country_name and
                    (not country.capital or normalized_capital_name == normalized_db_capital_name) and
                    normalized_flag == normalized_db_flag
                ):
                    # Check if the user has already collected the country
                    user_country, created = UserCountry.objects.get_or_create(user=user, country=country)
                    
                    if user_country.collected:
                        return Response({'message': 'Country already collected'}, status=status.HTTP_200_OK)
                    
                    # Mark the country as collected
                    user_country.collected = True
                    user_country.collected_date = timezone.now()
                    user_country.save()

                    return Response({'message': 'Country collected successfully', 'country_code': country.country_code}, status=status.HTTP_200_OK)

            # If no match found after iterating all countries
            return Response({'message': 'Incorrect country information'}, status=status.HTTP_400_BAD_REQUEST)

        except Country.DoesNotExist:
            return Response({'message': 'Incorrect country information'}, status=status.HTTP_400_BAD_REQUEST)
