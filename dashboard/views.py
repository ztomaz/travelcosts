from dashboard.forms import TravelForm
from dashboard.models import Travel
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Create your views here.


def dashboard(request):

    return render(request, "dashboard/template.html")


def dashboard_new_trip(request):
    if request.method == 'POST':
        form = Travel(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect("/home/template.html")
    else:
        form = TravelForm()


    return render(request, "dashboard/pages/trip.html", {
        'my_form': form,
    })


def save_travel(request):

    return render(request, "dashboard/pages/trip.html")