const cntrlrWrapper = cntrlr => {
  const func = async (req, res, next) => {
    try {
      await cntrlr(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

module.exports = cntrlrWrapper;
