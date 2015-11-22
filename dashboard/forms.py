import re
from dashboard.models import Travel
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django import forms
from django.forms import ModelForm
from home.models import TravelcostsUser

FIRST_LAST_NAME_REGEX = re.compile(r"^[\w ]+$", re.U)

class TravelForm(ModelForm):

    name = forms.CharField(label="Name", required=True, max_length=75,
                             help_text="Required field. 75 characters or fewer. Letters, digits and @/./+/-/_ characters only.",
                             error_messages={'invalid': "This value may contain only letters, digits and characters @/./+/-/_."})
    description = forms.RegexField(label="Description", required=True, max_length=30, regex=FIRST_LAST_NAME_REGEX,
                                  help_text="Required field. 30 characters or fewer. Letters only and numbers only.",
                                  error_messages={'invalid': "This value may contain only letters and numbers."})
    color = forms.RegexField(label="Color", required=True, max_length=30, regex=FIRST_LAST_NAME_REGEX,
                                 help_text="Required field. 30 characters or fewer. Letters and numbers only.",
                                 error_messages={'invalid': "This value may contain only letters and numbers."})

    participants = forms.RegexField(label="Participants", required=True, max_length=30, regex=FIRST_LAST_NAME_REGEX,
                                 help_text="Required field. 30 characters or fewer. Letters and numbers only.",
                                 error_messages={'invalid': "This value may contain only letters and numbers."})

    class Meta:
        model = Travel
        fields = ("name", "description", "color", "participants")

