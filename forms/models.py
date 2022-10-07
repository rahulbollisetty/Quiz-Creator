from  django.db import models
from django.contrib.auth.models import User

class Options(models.Model):
    optn = models.CharField(max_length=1000)
    is_correct = models.BooleanField(default=False)

class Question(models.Model):
    ques = models.CharField(max_length=1000)
    req = models.BooleanField(default=False)
    key = models.CharField(max_length=1000,null=True)
    q_type = models.CharField(max_length=30)
    options = models.ManyToManyField(Options,related_name="options")
    points = models.IntegerField(null=True)

class Ans(models.Model):
    corresponds  = models.ForeignKey(Question,on_delete=models.CASCADE,related_name="corresponds")
    ans = models.CharField(max_length=10000)

class Exam(models.Model):
    uuid = models.CharField(max_length=30)
    title = models.CharField(max_length=100)
    desc = models.CharField(max_length=300)
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="owner")
    email = models.EmailField(null=True)
    questions = models.ManyToManyField(Question, related_name="questions")
    is_publish = models.BooleanField(default=False)
    view_score = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

class Responses(models.Model):
    response_code = models.CharField(max_length=20)
    response_to = models.ForeignKey(Exam, on_delete = models.CASCADE, related_name = "response_to")
    responder_ip = models.CharField(max_length=30)
    responder = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "responder", blank = True, null = True)
    responder_email = models.EmailField(blank = True,null=True)
    response = models.ManyToManyField(Ans, related_name = "response")
    submittedAt = models.DateTimeField(auto_now_add=True)
