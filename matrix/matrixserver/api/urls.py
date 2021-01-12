from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

from . import views

urlpatterns = [
    url(_(r'auto_complete/location/$'),
        views.location_search, name='auto_location'),
    url(_(r'locations/compare_cities/$'),
        views.compare_cities, name='compare_cities'),
    url(_(r'crime_stats/$'), views.crime_stats, name='crime_stats'),
]
