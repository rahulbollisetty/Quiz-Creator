from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .forms import NewUserForm,ProfileForm
from django.contrib import messages
from .models import Profile
from django.contrib.auth.models import User

# Create your views here.

def home(request):
    return render(request,'index.html')
def profile(request):
    return render(request,'profile.html',)
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password  = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create(username=username,email=email)
            user.set_password(password)
            user.save()
            login(request,user)
            messages.success(request,'Username registered')
            return redirect('form')

        messages.error(request,'Username Exists')
    return render(request,'register.html')

def login_request(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username,password=password)
        print(user)
        if user is not None:
            login(request,user)
            messages.info(request,f"You are now logged in as {username}")
            return redirect('form')
        else:
            messages.error(request,'Invalid username or password')

    return render(request,'login.html') 
        
def logout_request(request):
	logout(request)
	messages.info(request, "You have successfully logged out.") 
	return redirect("login")

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