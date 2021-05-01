from django.urls import path
from . import views

urlpatterns=[
    path('form',views.index,name="form"),
    path('create',views.create,name='create_form'),
    path('delete_form',views.delete_form,name='delete_form'),
    path('<str:id>/edit', views.edit_form, name="edit_form"),
    path('<str:id>/form_publish', views.form_publish, name="form_publish"),
    path('<str:id>/edit_title', views.edit_title, name="edit_title"),
    path('<str:id>/edit_desc', views.edit_desc, name="edit_desc"),
    path('<str:id>/add_question', views.add_question, name="add_question"),
    path('<str:id>/edit_choice', views.edit_choice, name="edit_choice"),
    path('<str:id>/add_choice', views.add_choice, name="add_choice"),
    path('<str:id>/remove_choice', views.remove_choice, name="remove_choice"),
    path('<str:id>/edit_question', views.edit_question, name="edit_question"),
    path('<str:id>/delete_question/<str:q_id>', views.delete_question, name="delete_question"),


]