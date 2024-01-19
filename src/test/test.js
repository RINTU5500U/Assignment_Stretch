// Import the studentModel after mocking it
const studentModel = require('../models/studentModel');
const request = require('supertest');
const express = require('express');
// Mock the studentModel to avoid actual database interactions
jest.mock('../models/studentModel');

const app = express();
app.use(express.json());

// Mock the findOne method to return null by default
studentModel.findOne.mockResolvedValue(null);

// Mock the create method to return the saved data
studentModel.create.mockImplementation((data) => Promise.resolve(data));

// Test case for createStudent API
test('createStudent API should create a new student', async () => {
  const mockRequestBody = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    dateOfGrad: '2022-12-31',
    github: 'https://github.com/johndoe/my-repo',
    website: 'https://johndoe.com',
    fieldOfInterest: ['Web Development'],
    seeking: ['Internship'],
    techStack: ['JavaScript', 'HTML', 'CSS'],
  };

  // Simulate a POST request to the createStudent API
  const response = await request(app)
    .post('/createStudent')
    .send(mockRequestBody)
    .expect(StatusCodes.CREATED)

  // Assert that the response matches the expected data
  expect(response.body).toEqual({
    status: true,
    msg: 'Data created successfully',
    Data: mockRequestBody,
  });
});

test('createStudent API should return an error if the email is already taken', async () => {
  const mockRequestBody = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    dateOfGrad: '2022-12-31',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.com',
    fieldOfInterest: ['Web Development'],
    seeking: ['Internship'],
    techStack: ['JavaScript', 'HTML', 'CSS'],
  };

  // Mock the findOne method to return a student, indicating that the email is already taken
  studentModel.findOne.mockResolvedValue({ email: 'john@example.com' });

  // Simulate a POST request to the createStudent API
  const response = await request(app)
    .post('/createStudent')
    .send(mockRequestBody)
    .expect(400)

  // Assert that the response matches the expected error message
  expect(response.body).toEqual({
    status: true,
    msg: 'One user is available with this email. Please try a different email.',
  });
});
