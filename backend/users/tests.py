from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class UserAuthTests(APITestCase):

    def test_register_user_success(self):
        url = reverse('register_user')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['username'], 'testuser')

    def test_register_user_missing_password(self):
        url = reverse('register_user')
        data = {'username': 'testuser'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_obtain_token_success(self):
        # First create user
        self.client.post(reverse('register_user'), {'username': 'tokenuser', 'password': 'testpass123'}, format='json')
        # Now obtain token
        url = reverse('token_obtain_pair')
        data = {'username': 'tokenuser', 'password': 'testpass123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_obtain_token_bad_credentials(self):
        url = reverse('token_obtain_pair')
        data = {'username': 'baduser', 'password': 'wrongpass'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)
