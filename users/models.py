from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class UserManager(BaseUserManager):
    def create_user(self, username,email, name, profile_image, password=None):
        """
        Creates and saves a User with the given email, name and password.
        """
        if not username:
            raise ValueError("Users must have an username ")
        elif not email:
            raise ValueError("Users must have an email ")
        elif not name:
            raise ValueError("Users must have an name ")
        # elif not profile_image:
        #     raise ValueError("Users must have an profile_image ")
        user = self.model(
            username=self.normalize_email(username),
            name=name,
            email=email,
            profile_image=profile_image
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email,username, name, profile_image, password=None):
        """
        Creates and saves a superuser with the given email, name and password.
        """
        user = self.create_user(
            username=username,
            password=password,
            name=name,
            email=email,
            profile_image=profile_image
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    username = models.CharField(
        verbose_name="UserName",
        max_length=32,
        unique=True
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255,unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ["name", "email", "profile_image"]

    # @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    # def create_auth_token(sender, instance=None, created=False, **kwargs):
    #     if created:
    #         from rest_framework.authtoken.models import Token
    #         Token.objects.create(user=instance)

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    class Meta:
        db_table = "users"
