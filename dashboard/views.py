from django.shortcuts import render

# Create your views here.


def dashboard(request):

    return render(request, "dashboard/index.html")



def dashboard_index(request):

    return render(request, "dashboard/pages/index.html")