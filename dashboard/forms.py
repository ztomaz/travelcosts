import re
from dashboard.models import Travel
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django import forms
from home.models import TravelcostsUser

FIRST_LAST_NAME_REGEX = re.compile(r"^[\w ]+$", re.U)

class TravelForm:

    class Meta:
        model = Travel
        fields = ("name", "description", "color", "participants")