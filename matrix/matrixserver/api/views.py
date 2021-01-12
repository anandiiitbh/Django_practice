import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view
from rest_framework.response import Response

from api import dataservice
from api.locationsearch import LocationsSearch
from api.crimestats import CrimeStats

locations_searcher = LocationsSearch()
crime_statistics = CrimeStats()


@api_view(['GET'])
@csrf_exempt
def location_search(request):
    count = 10
    q = request.query_params.get("q")
    matches = locations_searcher.search(q, count)
    return Response({"items": matches})


@api_view(['GET'])
@csrf_exempt
def crime_stats(request):
    dataservice.ensure_data()
    type = request.query_params.get("type")
    result = crime_statistics.getStats(type)
    return Response({"Crime Type": type, "Stats": result, "types of crime": dataservice.data_cache["city_crime_meta"][2:10]})


@api_view(['POST'])
@csrf_exempt
def compare_cities(request):
    '''
    POST Data:
    [{"city":"San Bruno", "state":"CA"}, {"city":"Houston", "state":"TX"},  {"city":"Las Vegas", "state":"NV"}]
    '''
    d = request.data
    locations = d["locations"]
    categories = d["parameters"].split(",")
    res = dataservice.compare_cities(locations, categories)
    return JsonResponse(res)
