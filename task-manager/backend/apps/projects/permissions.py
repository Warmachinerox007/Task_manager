from rest_framework.permissions import BasePermission
from .models import ProjectMember

class IsProjectMember(BasePermission):
    def has_permission(self, request, view):
        project_id = view.kwargs.get('project_id') or view.kwargs.get('pk')
        return ProjectMember.objects.filter(
            project_id=project_id,
            user=request.user
        ).exists()

class IsProjectAdmin(BasePermission):
    def has_permission(self, request, view):
        project_id = view.kwargs.get('project_id') or view.kwargs.get('pk')
        return ProjectMember.objects.filter(
            project_id=project_id,
            user=request.user,
            role='admin'
        ).exists()
