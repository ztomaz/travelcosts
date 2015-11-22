from django.shortcuts import render

# Create your views here.


def dashboard(request):

    return render(request, "dashboard/template.html")


def dashboard_new_trip(request):

    return render(request, "dashboard/pages/forms.html")