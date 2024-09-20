from django.db import models
from django.contrib.auth.models import User


class Country(models.Model):
    country_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2, unique=True, null=True, blank=True)
    capital = models.CharField(max_length=100, null=True, blank=True)
    flag_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.country_name


class UserCountry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    collected = models.BooleanField(default=False)
    collected_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'country')