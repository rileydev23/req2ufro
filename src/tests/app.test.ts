jest.mock("../config/mongo", () => jest.fn(() => Promise.resolve(true)));
jest.mock("../schemas/user.schema", () => ({
  exists: jest.fn(() => Promise.resolve(false)),
  save: jest.fn(() => Promise.resolve(true)),
}));

import app from "../app";
import request from "supertest";

describe("GET /", () => {
  it('should return a message saying "miaau!"', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "miaau!" });
  });
});
