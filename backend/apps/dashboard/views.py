from rest_framework.views import APIView
from rest_framework.response import Response
from apps.tasks.models import Task
from apps.projects.models import ProjectMember
from apps.tasks.serializers import TaskSerializer
from django.utils import timezone

class DashboardView(APIView):
    def get(self, request):
        user = request.user
        assigned_tasks = Task.objects.filter(assigned_to=user).select_related('project')
        today = timezone.now().date()

        overdue = assigned_tasks.filter(
            due_date__lt=today
        ).exclude(status='done')

        my_project_ids = ProjectMember.objects.filter(user=user).values_list('project_id', flat=True)

        return Response({
            'total_tasks': assigned_tasks.count(),
            'todo': assigned_tasks.filter(status='todo').count(),
            'in_progress': assigned_tasks.filter(status='in_progress').count(),
            'done': assigned_tasks.filter(status='done').count(),
            'overdue': TaskSerializer(overdue, many=True).data,
            'my_projects': my_project_ids.count(),
        })
