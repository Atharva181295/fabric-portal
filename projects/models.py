from django.db import models
from users.models import User


# Create your models here.
class Project(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=False)
    name = models.CharField(null=False)
    code = models.CharField(null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    description = models.CharField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        ordering = ['-created_at']

    def __str__(self):

        return f"{self.id}.{self.name}"