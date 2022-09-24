from django import forms
from django.forms import ModelForm,TextInput,EmailInput,NumberInput
from django.contrib.auth.forms import UserCreationForm
from django.conf import settings
from .models import Profile
from django.http import request
from django.conf import settings
from django.contrib.auth.models import User

# Create your forms here.

class NewUserForm(UserCreationForm):
	email = forms.EmailField()
	class Meta:
		model = User
		fields = ("username", "email","password1", "password2")
 

class ProfileForm(ModelForm):
	class Meta:
		model = Profile
		fields = ('name','phone','email','pincode','state','city')
		widgets = {
            'name': TextInput(attrs={'placeholder' : 'Enter Your Name','maxlength':25}),
			'phone' : TextInput(attrs={'placeholder':'Enter Your Phone Number','maxlength':10}),
			'email' : EmailInput(attrs={'placeholder' : 'Enter Your Email'}),
			'pincode' : TextInput(attrs={'placeholder' : 'Enter Pincode','maxlength':6}),
			'state' : TextInput(attrs={'placeholder' : 'Enter State'}),
			'city' : TextInput(attrs={'placeholder' : 'Enter City'})
        }
