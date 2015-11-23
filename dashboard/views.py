from dashboard.forms import TravelForm, TravelCostForm
from dashboard.models import Travel, TravelCost
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Create your views here.

@login_required(redirect_field_name="index")
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


def edit_cost(request):
    if request.method == 'POST':
        form = TravelCostForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect("/home/template.html")
    else:
        form = TravelCostForm()


    return render(request, "dashboard/pages/cost.html", {
        'my_form': form,
    })


def save_travel(request):

    return render(request, "dashboard/pages/trip.html")


def support(request):
    return render(request, "dashboard/pages/support.html")