from django.db import models


# Create your models here.
class Candidate(models.Model):
    candidateName = models.CharField(blank=True,null=True)
    candidateRollNo = models.CharField(blank=True,null=True)
    venueName = models.CharField(blank=True,null=True)
    examDate=models.DateField(blank=True,null=True)
    startTime=models.TimeField(blank=True,null=True)
    endTime=models.TimeField(blank=True,null=True)
    examBatch=models.BigIntegerField(blank=True,null=True)
    examLabNo=models.CharField(blank=True,null=True)
    fatherName = models.CharField(blank=True,null=True)
    address = models.CharField(blank=True,null=True)
    contactNo = models.BigIntegerField(blank=True,null=True)
    examId = models.CharField(blank=True,null=True)
    invigilatorId = models.CharField(blank=True,null=True)
    takeCount = models.BigIntegerField(blank=True,null=True)
    benchNo = models.BigIntegerField(blank=True,null=True)
    registrationNo=models.BigIntegerField(blank=True,null=True)
    floorNumber = models.BigIntegerField(blank=True,null=True)
    candidatePhoto = models.CharField(blank=True,null=True)
    registerPhoto = models.CharField(blank=True,null=True)
    cpId = models.CharField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "candidate_details"
        ordering = ['-created_at']

    def __str__(self):

        return f"{self.id}.{self.candidateName}"
