from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
from apps.projects.permissions import IsProjectMember, IsProjectAdmin
from apps.projects.models import ProjectMember

class TaskListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsProjectAdmin()]
        return [IsProjectMember()]

    def get(self, request, project_id):
        tasks = Task.objects.filter(project_id=project_id).select_related('assigned_to', 'created_by')
        return Response(TaskSerializer(tasks, many=True).data)

    def post(self, request, project_id):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project_id=project_id, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class TaskStatusUpdateView(APIView):
    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        is_admin = ProjectMember.objects.filter(
            project=task.project, user=request.user, role='admin'
        ).exists()
        is_assignee = task.assigned_to == request.user

        if not is_admin and not is_assignee:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status not in ['todo', 'in_progress', 'done']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        task.save()
        return Response(TaskSerializer(task).data)

class TaskDeleteView(APIView):
    permission_classes = [IsProjectAdmin]

    def delete(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
