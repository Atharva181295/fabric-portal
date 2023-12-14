from django.contrib import admin
from .models import Candidate
# Register your models here.


class CandidateAdmin(admin.ModelAdmin):
    pass


admin.site.register(Candidate,CandidateAdmin)