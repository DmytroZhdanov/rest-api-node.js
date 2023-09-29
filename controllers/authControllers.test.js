const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest");

const { DB_HOST, LOGIN_TEST_EMAIL, LOGIN_TEST_PASSWORD } = process.env;

const reqBody = {
  email: LOGIN_TEST_EMAIL,
  password: LOGIN_TEST_PASSWORD,
};

let response = null;

// Unit tests for login controller
describe("log in", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    response = await request(app).post("/api/users/login").send(reqBody);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Status code test
  test("response status code must be 200", async () => {
    expect(response.statusCode).toBe(200);
  });

  // Token tests
  test("response should include key 'token'", async () => {
    expect(response.body).toHaveProperty("token");
  });
  test("key 'token' in response should be defined", async () => {
    expect(response.body.token).toBeDefined();
  });
  test("'token' property in response should be 'String'", async () => {
    expect(typeof response.body.token).toBe("string");
  });

  // User object tests
  test("response should include key 'user'", async () => {
    expect(response.body).toHaveProperty("user");
  });
  test("'user' property in response should be 'object'", async () => {
    expect(response.body.user).toBeInstanceOf(Object);
  });
  test("'user' object in response should have 2 keys", async () => {
    expect(Object.keys(response.body.user).length).toBe(2);
  });
  test("'user' object in response should have key 'email'", async () => {
    expect(response.body.user).toHaveProperty("email");
  });
  test("'email' property in 'user' object from response should be 'String' ", async () => {
    expect(typeof response.body.user.email).toBe("string");
  });
  test("'user' object in response should have key 'subscription'", async () => {
    expect(response.body.user).toHaveProperty("subscription");
  });
  test("'subscription' property in 'user' object from response should be 'String' ", async () => {
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
