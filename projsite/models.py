from django.db import models

# Create your models here.


class Users(models.Model):
    login = models.CharField(max_length=25, unique=True)
    address = models.CharField(max_length=65, unique=True, default='None' )
    password = models.CharField(max_length=300)
    def __str__(self):
        return self.login


class Dialogs(models.Model):
    did = models.AutoField(primary_key=True)
    sender = models.CharField(max_length=25)
    reciever = models.CharField(max_length=25)

    def __str__(self):
        return self.sender


class Messages(models.Model):
    did = models.PositiveIntegerField()
    sender = models.CharField(max_length=25, default='None')
    text = models.TextField(max_length=200)
    date = models.DateTimeField(unique_for_date=True, auto_now_add=True)

    def __str__(self):
        return self.sender

