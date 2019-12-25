import json
import unittest

from src.app import create_app, db


class UsersTest(unittest.TestCase):
    """
    User test case
    """

    def setUp(self):
        """
        Test setup
        """
        self.app = create_app("testing")
        self.client = self.app.test_client
        self.user = {
            'name': "reda",
            'email': "reda@pettywell.com",
            'password': "password"
        }

        with self.app.app_context():
            db.create_all()

    def test_user_creation(self):
        """
        test user creation with valid credentials
        """
        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'},
                                 data=json.dumps(self.user))
        json_data = json.loads(res.data)
        self.assertTrue(json_data.get('jwt_token'))
        self.assertEqual(res.status_code, 201)

    def test_user_creation_with_existing_email(self):
        """
        test user creation with already existion email
        """
        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'},
                                 data=json.dumps(self.user))
        self.assertEqual(res.status_code, 201)

        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'},
                                 data=json.dumps(self.user))
        json_data = json.loads(res.data)
        self.assertEqual(res.status_code, 400)
        self.assertTrue(json_data.get('error'))

    def test_user_creation_with_no_password(self):
        """
        test user creation with no password
        """
        user1 = {
            'name': "reda",
            'email': "reda@pettywell.com"
        }
        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'}, data=json.dumps(user1))
        json_data = json.loads(res.data)
        self.assertTrue(json_data.get('error'))
        self.assertFalse(json_data.get('password'))
        self.assertEqual(res.status_code, 400)

    def test_user_creation_with_no_email(self):
        """
        Test user creation with no email
        """
        user1 = {
            'name': "reda",
            'password': "password"
        }

        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'}, data=json.dumps(user1))
        json_data = json.loads(res.data)
        self.assertEqual(res.status_code, 400)
        self.assertTrue(json_data.get('error'))

    def test_user_creation_with_empty_request(self):
        """
        Test user creation with empty request
        """
        user1 = {}
        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'}, data=json.dumps(user1))
        json_data = json.loads(res.data)
        self.assertEqual(res.status_code, 400)
        self.assertTrue(json_data.get('error'))

    def test_user_login(self):
        """
        Test user login
        """
        # Create new user
        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'}, data=json.dumps(self.user))
        self.assertEqual(res.status_code, 201)

        # login user
        res = res = self.client().post('api/v1/users/login', headers={'Content-Type': 'application/json'}, data=json.dumps(self.user))
        json_data = json.loads(res.data)
        print(json_data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(json_data.get('Jwt_token'))

    def test_user_login_with_invalid_user(self):
        """
        Test login user with invalid password
        """
        # Create new user
        res = self.client().post('api/v1/users/', headers={'Content-Type': 'application/json'},
                                 data=json.dumps(self.user))
        self.assertEqual(res.status_code, 201)

        user1 = {
            'email': "reda@pettywell.com",
            'password': "testtest"
        }

        # Log in with invalid password
        res = self.client().post('api/v1/users/login', headers={'Content-Type': 'application/json'},
                                 data=json.dumps(user1))
        json_data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertTrue(json_data.get('error'))

    def test_user_login_with_invalid_email(self):
        """
        Test login user with invalid email
        """
        # Create new user
        res = self.client().post('api/v1/users/',
                                 headers={'Content-Type': 'application/json'},
                                 data=json.dumps(self.user))

        self.assertEqual(res.status_code, 201)

        user1 = {
            'email': "cris@pettywell.com",
            'password': "password"
        }

        # Log in with invalid email
        res = self.client().post('api/v1/users/login', headers={'Content-Type': 'application/json'},
                                 data=json.dumps(user1))
        json_data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertTrue(json_data.get('error'))

    def tearDown(self):
        """
        Tear down
        """
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == '__main__':
    unittest.main()
