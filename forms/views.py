from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import User,Options,Question,Ans,Exam
from acc.models import Profile
import json
import random
import string
import uuid
# Create your views here.
def index(request):
    return render(request,'index.html')
def create(request):
    if request.method == "POST":
        data = json.loads(request.body)
        title = data["title"]
        exam_id = str(uuid.uuid4()).replace('-','')[0:30]
        form = Exam(uuid= exam_id, title= title, owner= request.user)
        form.save()
        return JsonResponse({"message": "Sucess", "code": exam_id})

def edit_form(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    else:
        return render(request,'exam_form.html',{"code" : id,'form':form})

def edit_title(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        if len(data["title"]) > 0 :
            form.title = data["title"]
            form.save()
        else:
            form.title = form.title[0]
            form.save()
        return JsonResponse({"message" : "Success"})
def edit_desc(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        form.desc = data["description"]
        form.save()
        return JsonResponse({"message": "Success", "description": form.desc})

def add_question(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        choices = Options(optn = "Option 1")
        choices.save()
        question = Question(q_type=data["type"], ques="Untitled Question", req=False)
        question.save()
        question.options.add(choices)
        question.save()
        form.questions.add(question)
        form.save()
        return JsonResponse({'question': {'ques': "Untitled Question", 'q_type': question.q_type, 'req': False, 'id': question.id},
        'choices': {'optn': "Option 1", 'is_correct': False, 'id': choices.id}})

def edit_choice(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        optn_id = data["id"]
        choice = Options.objects.filter(id=optn_id)
        if choice.count() == 0:
            return HttpResponse("choices not found")
        else:
            choice = choice[0]
        choice.optn = data["option"]
        choice.save()
        return JsonResponse({"message": "Success"})

def add_choice(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        choice = Options(optn="Option")
        choice.save()
        form.questions.get(pk=data["question"]).options.add(choice)
        form.save()
        return JsonResponse({"message":"Success", "choice": choice.optn,"id": choice.id})

def remove_choice(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        choice = Options.objects.filter(id=data["id"])
        if choice.count() == 0:
            return HttpResponse("choices not found")
        else: choice = choice[0]
        choice.delete()
        return JsonResponse({"message": "Success"})

def edit_question(request,id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "POST":
        data = json.loads(request.body)
        quest_id = data["id"]
        question = Question.objects.filter(id=quest_id)
        if question.count() == 0:
            return HttpResponse("Question not found")
        else:
            question = question[0]
        question.ques = data["question"]
        question.q_type = data["q_type"]
        question.req = data["req"]
        question.save()
        return JsonResponse({"message" : "Success"})

def delete_question(request,id,q_id):
    form = Exam.objects.filter(uuid=id)
    if form.count() == 0:
        return HttpResponse("exam form not found")
    else:
        form = form[0]
    if form.owner != request.user:
        return HttpResponse("You are not authorised to access this form")
    if request.method == "DELETE":
        question = Question.objects.filter(id=q_id)
        if question.count() == 0:
            return HttpResponse("Question not found")
        else:
            question = question[0] 
        for choice in question.options.all():
            choice.delete()
        question.delete()
        return JsonResponse({"message" : "Success"})