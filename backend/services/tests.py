from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Service

User = get_user_model()

class ServiceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_create_service(self):
        data = {"name": "Water Heater Install", "duration_minutes": 150}
        response = self.client.post("/services/", data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Service.objects.count(), 1)

    def test_list_services(self):
        Service.objects.create(user=self.user, name="Plumbing", duration_minutes=90)
        response = self.client.get("/services/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_update_service(self):
        service = Service.objects.create(user=self.user, name="Old Name", duration_minutes=60)
        response = self.client.put(f"/services/{service.id}/", {
            "name": "Updated",
            "duration_minutes": 45
        }, format="json")
        self.assertEqual(response.status_code, 200)
        service.refresh_from_db()
        self.assertEqual(service.name, "Updated")

    def test_delete_service(self):
        service = Service.objects.create(user=self.user, name="Temp", duration_minutes=30)
        response = self.client.delete(f"/services/{service.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Service.objects.count(), 0)

    def test_unauthenticated_access(self):
        self.client.credentials()  # Remove token
        response = self.client.get("/services/")
        self.assertEqual(response.status_code, 401)
