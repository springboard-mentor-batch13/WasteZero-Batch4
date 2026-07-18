const escapeRegex = (str = "") => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export default escapeRegex;