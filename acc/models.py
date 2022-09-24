from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import RegexValidator
# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=25,null=True)
    phone = models.CharField(max_length=10,null=True)
    email = models.EmailField(null=True)
    pincode = models.CharField(null=True,validators=[RegexValidator(r'^\d{1,10}$')],max_length=6)
    state = models.CharField(max_length=50,null=True)
    city = models.CharField(max_length=50,null=True)
    def __str__(self):
        return self.name

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    print(instance)
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()