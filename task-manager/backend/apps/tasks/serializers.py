from rest_framework import serializers
from .models import Task
from apps.users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to', 'assigned_to_detail',
                  'status', 'priority', 'due_date', 'created_at', 'project', 'project_name']
        read_only_fields = ['created_by', 'created_at', 'project']
