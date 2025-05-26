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

class JobDetailAPITests(APITestCase):

    def setUp(self):
        self.job = Job.objects.create(
            customer_name="Eve",
            customer_phone="555-123-4567",
            address="789 Pine St",
            description="Fix leaking pipe",
            scheduled_time="2025-06-10T14:00:00Z"
        )

    def test_get_job_details_success(self):
        url = reverse('get_job_details', kwargs={'pk': self.job.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['customer_name'], self.job.customer_name)
        self.assertEqual(response.data['description'], self.job.description)

    def test_get_job_details_not_found(self):
        url = reverse('get_job_details', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

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

class JobDeleteAPITests(APITestCase):

    def setUp(self):
        self.job = Job.objects.create(
            customer_name="Charlie",
            customer_phone="777-888-9999",
            address="300 Pine St",
            description="Repair leak",
            scheduled_time="2025-06-03T11:00:00Z"
        )

    def test_delete_job_success(self):
        url = reverse('delete_job', kwargs={'pk': self.job.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Job.objects.filter(pk=self.job.pk).exists())

    def test_delete_job_not_found(self):
        url = reverse('delete_job', kwargs={'pk': 9999})  # non-existent pk
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

class JobUpdateAPITests(APITestCase):

    def setUp(self):
        self.job = Job.objects.create(
            customer_name="Dana",
            customer_phone="111-222-3333",
            address="400 Oak St",
            description="Install new faucet",
            scheduled_time="2025-06-04T09:00:00Z"
        )

    def test_update_job_partial(self):
        url = reverse('update_job', kwargs={'pk': self.job.pk})
        data = {'description': 'Replace faucet with new model'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job.refresh_from_db()
        self.assertEqual(self.job.description, data['description'])

    def test_update_job_full(self):
        url = reverse('update_job', kwargs={'pk': self.job.pk})
        data = {
            'customer_name': "Dana Updated",
            'customer_phone': "444-555-6666",
            'address': "500 Birch St",
            'description': "Full bathroom remodel",
            'scheduled_time': "2025-06-05T10:00:00Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job.refresh_from_db()
        self.assertEqual(self.job.customer_name, data['customer_name'])
        self.assertEqual(self.job.description, data['description'])

    def test_update_job_not_found(self):
        url = reverse('update_job', kwargs={'pk': 9999})  # non-existent job
        data = {'description': 'Will not work'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)