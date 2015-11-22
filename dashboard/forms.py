import re
from dashboard.models import Travel
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django import forms
from home.models import TravelcostsUser

FIRST_LAST_NAME_REGEX = re.compile(r"^[\w ]+$", re.U)
class MyRegistrationForm(UserCreationForm):
    email = forms.EmailField(label="E-mail", required=True, max_length=75,
                             help_text="Required field. 75 characters or fewer. Letters, digits and @/./+/-/_ characters only.",
                             error_messages={'invalid': "This value may contain only letters, digits and characters @/./+/-/_."})
    first_name = forms.RegexField(label="First name", required=True, max_length=30, regex=FIRST_LAST_NAME_REGEX,
                                  help_text="Required field. 30 characters or fewer. Letters only and numbers only.",
                                  error_messages={'invalid': "This value may contain only letters and numbers."})
    last_name = forms.RegexField(label="Last name", required=True, max_length=30, regex=FIRST_LAST_NAME_REGEX,
                                 help_text="Required field. 30 characters or fewer. Letters and numbers only.",
                                 error_messages={'invalid': "This value may contain only letters and numbers."})



    class Meta:
        model = TravelcostsUser
        fields = ("email", "first_name", "last_name") #"country", "images", "sex", )


class LoginForm(forms.ModelForm):

    email = forms.EmailField(label="E-mail", required=True, max_length=75,
                             help_text="Required field. 75 characters or fewer. Letters, digits and @/./+/-/_ characters only.",
                             error_messages={'invalid': "This value may contain only letters, digits and characters @/./+/-/_."})
    password = forms.CharField(label="Password", widget=forms.PasswordInput, required=False)

    class Meta:
        model = TravelcostsUser
        fields = ("email", "password")

    def set_request(self, request):
        self.request = request


class TravelForm:

    class Meta:
        model = Travel
        fields = ("name", "description", "color", "participants")