from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Job

class JobListAPITests(APITestCase):

    def setUp(self):
        # Create some sample jobs to list
        Job.objects.create(
            customer_name="Alice",
            customer_phone="111-222-3333",
            address="100 Main St",
            description="Fix sink",
            scheduled_time="2025-06-01T09:00:00Z"
        )
        Job.objects.create(
            customer_name="Bob",
            customer_phone="444-555-6666",
            address="200 Oak Ave",
            description="Unclog drain",
            scheduled_time="2025-06-02T10:00:00Z"
        )

    def test_list_jobs(self):
        url = reverse('list_jobs')
        response = self.client.get(url, format='json')

        # Should return 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should return 2 jobs
        self.assertEqual(len(response.data), 2)

        # Check one job's customer_name
        self.assertEqual(response.data[0]['customer_name'], "Bob")  # Because of order_by descending scheduled_time
        self.assertEqual(response.data[1]['customer_name'], "Alice")

class JobAPITests(APITestCase):
    def test_create_job(self):
        url = reverse('create_job')
        data = {
            "customer_name": "John Doe",
            "customer_phone": "555-1234",
            "address": "123 Main St",
            "description": "Fix leaking pipe",
            "scheduled_time": "2025-06-01T10:00:00Z"
        }
        response = self.client.post(url, data, format='json')

        # Assert the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert the response data matches input data
        self.assertEqual(response.data['customer_name'], data['customer_name'])
        self.assertEqual(response.data['customer_phone'], data['customer_phone'])
        self.assertEqual(response.data['address'], data['address'])
        self.assertEqual(response.data['description'], data['description'])
        self.assertEqual(response.data['scheduled_time'], data['scheduled_time'])

        # Assert the job was created in the database
        from .models import Job
        self.assertEqual(Job.objects.count(), 1)
        job = Job.objects.first()
        self.assertEqual(job.customer_name, data['customer_name'])

    def test_create_job_missing_required_fields(self):
        url = reverse('create_job')

        # Missing all required fields (empty payload)
        data = {}

        response = self.client.post(url, data, format='json')

        # Should return 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Response should contain error messages for required fields
        self.assertIn('customer_name', response.data)
        self.assertIn('customer_phone', response.data)
        self.assertIn('address', response.data)
        self.assertIn('scheduled_time', response.data)
