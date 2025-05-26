from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Appointment

class AppointmentListAPITests(APITestCase):

    def setUp(self):
        # Create some sample appointments to list
        Appointment.objects.create(
            customer_name="Alice",
            customer_phone="111-222-3333",
            address="100 Main St",
            description="Fix sink",
            scheduled_time="2025-06-01T09:00:00Z"
        )
        Appointment.objects.create(
            customer_name="Bob",
            customer_phone="444-555-6666",
            address="200 Oak Ave",
            description="Unclog drain",
            scheduled_time="2025-06-02T10:00:00Z"
        )

    def test_list_appointments(self):
        url = reverse('list_appointments')
        response = self.client.get(url, format='json')

        # Should return 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should return 2 appointments
        self.assertEqual(len(response.data), 2)

        # Check one appointment's customer_name
        self.assertEqual(response.data[0]['customer_name'], "Bob")  # Because of order_by descending scheduled_time
        self.assertEqual(response.data[1]['customer_name'], "Alice")

class AppointmentDetailAPITests(APITestCase):

    def setUp(self):
        self.appointment = Appointment.objects.create(
            customer_name="Eve",
            customer_phone="555-123-4567",
            address="789 Pine St",
            description="Fix leaking pipe",
            scheduled_time="2025-06-10T14:00:00Z"
        )

    def test_get_appointment_details_success(self):
        url = reverse('get_appointment_details', kwargs={'pk': self.appointment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['customer_name'], self.appointment.customer_name)
        self.assertEqual(response.data['description'], self.appointment.description)

    def test_get_appointment_details_not_found(self):
        url = reverse('get_appointment_details', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

class AppointmentAPITests(APITestCase):
    def test_create_appointment(self):
        url = reverse('create_appointment')
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

        # Assert the appointment was created in the database
        from .models import Appointment
        self.assertEqual(Appointment.objects.count(), 1)
        appointment = Appointment.objects.first()
        self.assertEqual(appointment.customer_name, data['customer_name'])

    def test_create_appointment_missing_required_fields(self):
        url = reverse('create_appointment')

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

class AppointmentDeleteAPITests(APITestCase):

    def setUp(self):
        self.appointment = Appointment.objects.create(
            customer_name="Charlie",
            customer_phone="777-888-9999",
            address="300 Pine St",
            description="Repair leak",
            scheduled_time="2025-06-03T11:00:00Z"
        )

    def test_delete_appointment_success(self):
        url = reverse('delete_appointment', kwargs={'pk': self.appointment.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Appointment.objects.filter(pk=self.appointment.pk).exists())

    def test_delete_appointment_not_found(self):
        url = reverse('delete_appointment', kwargs={'pk': 9999})  # non-existent pk
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

class AppointmentUpdateAPITests(APITestCase):

    def setUp(self):
        self.appointment = Appointment.objects.create(
            customer_name="Dana",
            customer_phone="111-222-3333",
            address="400 Oak St",
            description="Install new faucet",
            scheduled_time="2025-06-04T09:00:00Z"
        )

    def test_update_appointment_partial(self):
        url = reverse('update_appointment', kwargs={'pk': self.appointment.pk})
        data = {'description': 'Replace faucet with new model'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.description, data['description'])

    def test_update_appointment_full(self):
        url = reverse('update_appointment', kwargs={'pk': self.appointment.pk})
        data = {
            'customer_name': "Dana Updated",
            'customer_phone': "444-555-6666",
            'address': "500 Birch St",
            'description': "Full bathroom remodel",
            'scheduled_time': "2025-06-05T10:00:00Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.customer_name, data['customer_name'])
        self.assertEqual(self.appointment.description, data['description'])

    def test_update_appointment_not_found(self):
        url = reverse('update_appointment', kwargs={'pk': 9999})  # non-existent appointment
        data = {'description': 'Will not work'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)