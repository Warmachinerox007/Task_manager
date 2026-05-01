from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, ProjectMemberView

urlpatterns = [
    path('', ProjectListCreateView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('<int:project_id>/members/', ProjectMemberView.as_view()),
    path('<int:project_id>/members/<int:user_id>/', ProjectMemberView.as_view()),
]
