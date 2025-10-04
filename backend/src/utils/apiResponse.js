class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
    this.timestamp = new Date().toISOString();
  }

  static success(message = 'Success', data = null, statusCode = 200) {
    return new ApiResponse(statusCode, message, data);
  }

  static created(message = 'Resource created successfully', data = null) {
    return new ApiResponse(201, message, data);
  }

  static error(message = 'An error occurred', statusCode = 500) {
    return new ApiResponse(statusCode, message);
  }

  static badRequest(message = 'Bad request') {
    return new ApiResponse(400, message);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiResponse(401, message);
  }

  static forbidden(message = 'Access forbidden') {
    return new ApiResponse(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiResponse(404, message);
  }

  static conflict(message = 'Resource conflict') {
    return new ApiResponse(409, message);
  }

  static validationError(message = 'Validation failed', errors = []) {
    const response = new ApiResponse(422, message);
    response.errors = errors;
    return response;
  }
}

module.exports = ApiResponse;