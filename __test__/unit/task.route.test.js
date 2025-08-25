import taskRouter from '../../routes/task.route.js';
import httpMocks from 'node-mocks-http';

describe('Task Routes', () => {
  it("should return 405 for unsupported methods on /tasks", () => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: '/tasks'
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    taskRouter(req, res,next);
    expect(res.statusCode).toBe(405);
  });
  it("should return 405 for unsupported methods on /tasks/:id", () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/tasks/123'
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    taskRouter(req, res, next);
    expect(res.statusCode).toBe(405);
  });
  it("should return 200 for HEAD method", () => {
    const req = httpMocks.createRequest({
      method: 'HEAD',
      url: '/tasks'
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    taskRouter(req, res,next);
    expect(res.statusCode).toBe(200);
  });
  it("should return 200 for OPTIONS method", () => {
    const req = httpMocks.createRequest({
      method: 'OPTIONS',
      url: '/tasks'
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    taskRouter(req, res,next);
    expect(res.statusCode).toBe(200);
  });
  it("should return 405 for unsupported methods on /tasks/:id", () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/tasks/123'
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    taskRouter(req, res,next);
    expect(res.statusCode).toBe(405);
  });
});
