from django.contrib import admin
from django.urls import path, re_path, include
from projsite import views
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('', views.index),
    path('registration/', views.registration, name='regisration'),
    path('login/', views.login, name='login'),
    path('dialogs/', csrf_exempt(views.dialogs), name='dialogs'),
    path('transfer/', csrf_exempt(views.transfer), name='transfer'),
    path('dialogs/create/', views.create_dialog, name='create_dialog'),
    path('settings/',views.settings, name='settings'),
    path('logout/', views.logout, name='logout'),
]