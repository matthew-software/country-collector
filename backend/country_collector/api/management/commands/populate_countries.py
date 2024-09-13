import os
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Country

class Command(BaseCommand):
    help = 'Populate or clear country data from the database'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear country data instead of populating')

    def handle(self, *args, **options):
        if options['clear']:
            self.clear_countries()
        else:
            self.populate_countries()

    def clear_countries(self):
        # Delete all Country data (and related UserCountry due to CASCADE)
        Country.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all country data and related user data'))

    def populate_countries(self):
        # URL for restcountries API
        url = 'https://restcountries.com/v3.1/all'
        response = requests.get(url)
        
        if response.status_code == 200:
            countries_data = response.json()

            # Ensure the directory for flag images exists
            if not os.path.exists(settings.FLAG_IMAGE_DIR):
                os.makedirs(settings.FLAG_IMAGE_DIR)

            for country_data in countries_data:
                # Extract the relevant information from the API data
                country_name = country_data.get('name', {}).get('common')
                capital = country_data.get('capital', [None])[0]
                flag_url = country_data.get('flags', {}).get('png')

                if country_name and flag_url:
                    # Download the flag image and save it locally
                    flag_image_path = self.download_flag_image(flag_url, country_name)

                    # Populate the Country model in the database
                    Country.objects.update_or_create(
                        country_name=country_name,
                        defaults={
                            'capital': capital,
                            'flag_url': flag_image_path
                        }
                    )
                    self.stdout.write(self.style.SUCCESS(f'Successfully added/updated country: {country_name}'))

        else:
            self.stdout.write(self.style.ERROR('Failed to retrieve country data from the API'))

    def download_flag_image(self, flag_url, country_name):
        # Download the flag image from the provided URL
        response = requests.get(flag_url, stream=True)

        if response.status_code == 200:
            # Define the file path for the flag image
            file_name = f'{country_name.lower().replace(" ", "_")}_flag.png'
            file_path = os.path.join(settings.FLAG_IMAGE_DIR, file_name)

            # Save the image locally
            with open(file_path, 'wb') as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)

            return file_path
        else:
            self.stdout.write(self.style.ERROR(f'Failed to download flag image for {country_name}'))
            return None
