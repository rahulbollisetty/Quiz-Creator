from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User

# Create your views here.

def home(request):
    return render(request,'index.html')

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
            return redirect('form')
        
    return render(request,'login.html') 
        
def logout_request(request):
	logout(request)
	return redirect("login")
