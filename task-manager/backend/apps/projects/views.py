from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project, ProjectMember
from .serializers import ProjectSerializer, ProjectMemberSerializer
from .permissions import IsProjectMember, IsProjectAdmin
from apps.users.models import User

class ProjectListCreateView(APIView):
    def get(self, request):
        memberships = ProjectMember.objects.filter(user=request.user).select_related('project')
        projects = [m.project for m in memberships]
        serializer = ProjectSerializer(projects, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save(created_by=request.user)
            ProjectMember.objects.create(project=project, user=request.user, role='admin')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetailView(APIView):
    permission_classes_map = {'GET': [IsProjectMember], 'DELETE': [IsProjectAdmin]}

    def get_permissions(self):
        return [perm() for perm in self.permission_classes_map.get(self.request.method, [IsProjectMember])]

    def get(self, request, pk):
        try:
            project = Project.objects.prefetch_related('members__user', 'tasks').get(pk=pk)
            serializer = ProjectSerializer(project, context={'request': request})
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class ProjectMemberView(APIView):
    permission_classes = [IsProjectAdmin]

    def post(self, request, project_id):
        email = request.data.get('email')
        role = request.data.get('role', 'member')
        try:
            user = User.objects.get(email=email)
            member, created = ProjectMember.objects.get_or_create(
                project_id=project_id, user=user,
                defaults={'role': role}
            )
            if not created:
                return Response({'error': 'User already a member'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(ProjectMemberSerializer(member).data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, project_id, user_id):
        ProjectMember.objects.filter(project_id=project_id, user_id=user_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
