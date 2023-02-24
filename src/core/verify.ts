import Joi from "joi";
global.joi = Joi;

global.verify = (property, schema, callback) => {
  return (req, res, next) => {
    const { error } = joi
      .object()
      .keys(schema)
      .validate(req[property], { allowUnknown: true });
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { message } = error;
      if (!callback) {
        return common.res.parameter(res, { data: message });
      }
      callback(res);
    }
  };
};
