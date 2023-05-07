export function SuccessResponse(message: string, data) {
  return {
    success: true,
    message,
    data,
  };
}
