from django.urls import path
from .views import TaskListCreateView, TaskStatusUpdateView, TaskDeleteView

urlpatterns = [
    path('project/<int:project_id>/', TaskListCreateView.as_view()),
    path('<int:pk>/status/', TaskStatusUpdateView.as_view()),
    path('<int:pk>/', TaskDeleteView.as_view()),
]
