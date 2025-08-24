const connectionClients = new Map();

const getConnectionClient = (id) => {
  return connectionClients.get(id);
};

const setConnectionClient = (id, client) => {
  connectionClients.set(id, client);
};

export { getConnectionClient, setConnectionClient };
