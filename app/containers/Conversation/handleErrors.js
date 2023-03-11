const handleErrors = response => {
  if (!response.ok) {
    return Promise.reject(response.status);
  }
  return response;
};

export default handleErrors;
