const request = require("supertest");
const app = require("../index"); // Update with the correct path if necessary
const { describe } = require("node:test");

describe("fetch metadata", () => {
  it("should return metadata for valid URLs", async () => {
    const response = await request(app)
      .post("/fetch-metadata")
      .send({ urls: ["https://example.com"] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://example.com",
          title: expect.any(String),
        }),
      ])
    );
  });

  it("should return an error for invalid input", async () => {
    const response = await request(app)
      .post("/fetch-metadata")
      .send({ urls: "not an array" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

// describe('POST /fetch-metadata', () => {
//   it('should return metadata for valid URLs', async () => {
//     const response = await request(app)
//       .post('/fetch-metadata')
//       .send({ urls: ['https://example.com'] });

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({ url: 'https://example.com', title: expect.any(String) }),
//       ])
//     );
//   });

//   it('should return an error for invalid input', async () => {
//     const response = await request(app)
//       .post('/fetch-metadata')
//       .send({ urls: 'not an array' });

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });
// });
