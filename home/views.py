from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
# Create your views here.

from django.contrib.auth import authenticate as django_authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth.decorators import login_required

from django.shortcuts import render_to_response
from django.template import RequestContext
from home.forms import MyRegistrationForm, LoginForm

from django.contrib.auth import logout as django_logout

def index(request):

    # if the user is already logged in, redirect to select_company
    if request.user.is_authenticated():
        return redirect('dashboard:main')

    if request.method == 'POST':
        action = 'login'

        if request.POST.get('next', '') != '':
            next = request.POST.get('next')

        login_form = LoginForm(request.POST)

        if login_form.is_valid():
            message, next = login(request, login_form.cleaned_data)

            if message == 'logged-in':
                return redirect('dashboard:main')
    else:
        login_form = LoginForm()

    context = {
        'user': request.user,
        'login_form': login_form
    }

    return render(request, "home/index.html", context)


def login(request, data):

    username = data.get('email')
    password = data.get('password')


    user = django_authenticate(username=username, password=password)

    if user is not None:
        # log in
        django_login(request, user)
        # activate this user's language
        message = "logged-in"
    else:
        # error page: wrong name/password
        message = "login-failed"

    return message, next


def register(request):
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("/home/template.html")
    else:
        form = MyRegistrationForm()
    return render(request, "home/register.html", {
        'user_form': form,
    })



@login_required
def logout(request):
    django_logout(request)
    return redirect('index')

