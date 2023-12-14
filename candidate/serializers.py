from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from candidate import models


class CandidateBulkCreateUpdateSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        candidate_data = [models.Candidate(**item) for item in validated_data]
        return models.Candidate.objects.bulk_create(candidate_data)

    def update(self, instance, validated_data):
        instance_hash = {index: i for index, i in enumerate(instance)}
        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]
        writable_fields = [
            x
            for x in self.child.Meta.fields
            if x not in self.child.Meta.read_only_fields
        ]

        try:
            self.child.Meta.model.objects.bulk_update(result, writable_fields)
        except IntegrityError as e:
            raise ValidationError(e)

        return result


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Candidate
        fields = '__all__'
        read_only_fields = ['id', ]
        list_serializer_class = CandidateBulkCreateUpdateSerializer