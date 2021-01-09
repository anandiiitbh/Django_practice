from django.shortcuts import render
from .models import Board

# Create your views here.
from django.http import HttpResponse


def home(request):
    boards = Board.objects.all()
    return render(request, 'home.html', {'boards': boards})
