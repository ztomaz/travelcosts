from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Create your views here.

from django.shortcuts import render_to_response
from django.template import RequestContext
from home.forms import MyRegistrationForm


def index(request):
    return render_to_response('home/index.html')


def register(request):
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("/home/index.html")
    else:
        form = MyRegistrationForm()
    return render(request, "home/register.html", {
        'user_form': form,
    })
