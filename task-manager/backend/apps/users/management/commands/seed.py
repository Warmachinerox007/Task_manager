from django.core.management.base import BaseCommand
from apps.users.models import User
from apps.projects.models import Project, ProjectMember
from apps.tasks.models import Task
from django.utils import timezone
import datetime

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        admin_user, _ = User.objects.get_or_create(email='admin@demo.com', defaults={'name': 'Admin User'})
        admin_user.set_password('demo1234')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()

        member_user, _ = User.objects.get_or_create(email='member@demo.com', defaults={'name': 'Member User'})
        member_user.set_password('demo1234')
        member_user.save()

        project, _ = Project.objects.get_or_create(name='Demo Project', defaults={
            'description': 'A sample project to explore the app', 'created_by': admin_user
        })
        ProjectMember.objects.get_or_create(project=project, user=admin_user, defaults={'role': 'admin'})
        ProjectMember.objects.get_or_create(project=project, user=member_user, defaults={'role': 'member'})

        tasks = [
            {'title': 'Set up project repo', 'status': 'done', 'priority': 'high', 'assigned_to': admin_user},
            {'title': 'Design database schema', 'status': 'done', 'priority': 'high', 'assigned_to': admin_user},
            {'title': 'Build REST API', 'status': 'in_progress', 'priority': 'high', 'assigned_to': member_user},
            {'title': 'Write frontend components', 'status': 'in_progress', 'priority': 'medium', 'assigned_to': member_user},
            {'title': 'Deploy to Railway', 'status': 'todo', 'priority': 'medium', 'assigned_to': admin_user,
             'due_date': timezone.now().date() - datetime.timedelta(days=1)},
        ]
        for t in tasks:
            Task.objects.get_or_create(title=t['title'], project=project, defaults={**t, 'created_by': admin_user})

        self.stdout.write(self.style.SUCCESS('Seed data created. admin@demo.com / demo1234 | member@demo.com / demo1234'))
