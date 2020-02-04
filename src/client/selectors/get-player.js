const getPlayer = state => {
  return {
    id: state.id,
    isAdmin: state.isAdmin,
    status: state.status,
  };
};

export { getPlayer };
