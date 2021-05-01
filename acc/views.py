from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .forms import NewUserForm,ProfileForm
from django.contrib import messages
from .models import Profile
# Create your views here.

def home(request):
    return render(request,'base.html')
def profile(request):
    return render(request,'profile.html',)
def register(request):
    if request.method == 'POST':
        form = NewUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            print(user)
            login(request,user)
            messages.success(request,"Registration successful.")
            return redirect('home')
        messages.error(request,"Unsuccessful registration.Invalid Information")
    form =NewUserForm
    return render(request,'register.html',context={"register_form":form})

def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(request,data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username,password=password)
            if user is not None:
                login(request,user)
                messages.info(request,f"You are now logged in as {username}")
                return redirect('home')
            else:
                messages.error(request,'Invalid username or password')
        else:
            messages.error(request,'Invalid username or password')
    form = AuthenticationForm()
    return render(request,'login.html',context={"login_form":form}) 
        
def logout_request(request):
	logout(request)
	messages.info(request, "You have successfully logged out.") 
	return redirect("home")

def profile_edit(request):
    if request.method == "POST":
        form = ProfileForm(request.POST,instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request,'Your have successfully updated your Profile')
            return redirect('home')
    data = Profile.objects.get(user_id=request.user.id)
    data_json = {'name':data.name,'phone':data.phone,'email':data.email,'pincode':data.pincode,'city':data.city,'state':data.state}
    form = ProfileForm(initial=data_json)
    return render(request,'profile_edit.html',context={"profile_form":form})