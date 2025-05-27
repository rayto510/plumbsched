from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import WorkHour

User = get_user_model()

class WorkHourTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_get_work_hours_empty(self):
        response = self.client.get("/work_hours/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_post_and_get_work_hours(self):
        data = {
            "monday": ["09:00", "17:00"],
            "tuesday": ["10:00", "16:00"],
        }
        post_resp = self.client.post("/work_hours/", data, format="json")
        self.assertEqual(post_resp.status_code, 201)

        get_resp = self.client.get("/work_hours/")
        self.assertEqual(get_resp.status_code, 200)
        # Check returned data length
        self.assertEqual(len(get_resp.data), 2)
        # Optional: verify one entry matches expected data
        monday_hours = next((h for h in get_resp.data if h['day'] == 'monday'), None)
        self.assertIsNotNone(monday_hours)
        self.assertEqual(monday_hours['start_time'], '09:00:00')
        self.assertEqual(monday_hours['end_time'], '17:00:00')

    def test_delete_work_hours(self):
        # Create some work hours first
        WorkHour.objects.create(user=self.user, day="monday", start_time="09:00", end_time="17:00")
        WorkHour.objects.create(user=self.user, day="tuesday", start_time="10:00", end_time="16:00")
        self.assertEqual(WorkHour.objects.filter(user=self.user).count(), 2)

        delete_resp = self.client.delete("/work_hours/")
        self.assertEqual(delete_resp.status_code, 204)
        self.assertEqual(WorkHour.objects.filter(user=self.user).count(), 0)

    def test_delete_work_hours_when_none_exist(self):
        # Make sure user has no work hours
        self.assertEqual(WorkHour.objects.filter(user=self.user).count(), 0)

        delete_resp = self.client.delete("/work_hours/")
        self.assertEqual(delete_resp.status_code, 404)
        self.assertEqual(delete_resp.data['detail'], "No work hours to delete.")
