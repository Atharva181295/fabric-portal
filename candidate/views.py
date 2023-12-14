from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.response import Response
from candidate.models import Candidate
from candidate import models, serializers
from users.views import CsrfExemptSessionAuthentication
import math
from datetime import datetime


def validate_ids(data, field="id", unique=True):

    if isinstance(data, list):
        id_list = [int(x[field]) for x in data]

        if unique and len(id_list) != len(set(id_list)):
            raise ValidationError("Multiple updates to a single {} found".format(field))

        return id_list

    return [data]


class CandidateView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    serializer_class = serializers.CandidateSerializer
    queryset = Candidate.objects.all()

    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num
        search_param = request.GET.get("search")
        candidates = Candidate.objects.all()
        total_candidates = candidates.count()
        if search_param:
            candidates = candidates.filter(candidateName__icontains=search_param)
        serializer = self.serializer_class(candidates[start_num:end_num], many=True)
        return Response({
            "status": "success",
            "total": total_candidates,
            "page": page_num,
            "last_page": math.ceil(total_candidates / limit_num),
            "projects": serializer.data
        })


class CandidateCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (CsrfExemptSessionAuthentication, SessionAuthentication)
    serializer_class = serializers.CandidateSerializer
    queryset = Candidate.objects.all()

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super(CandidateCreateView, self).get_serializer(*args, **kwargs)

    def get_queryset(self, ids=None):
        if ids :
            queryset = models.Candidate.objects.filter(id__in=ids)
        else:
            queryset = models.Candidate.objects.all()
        return queryset

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):

        ids = validate_ids(request.data)

        instances = self.get_queryset(ids=ids)

        serializer = self.get_serializer(
            instances, data=request.data, partial=False, many=True
        )

        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()