const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};
const middleware = { unknownEndpoint };
module.exports = middleware;
