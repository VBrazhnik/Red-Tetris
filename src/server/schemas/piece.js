import Joi from '@hapi/joi';
import { PLACED } from '../constants/piece-statuses';
import { EMPTY, FILLED } from '../constants/cell-types';

const pieceSchema = Joi.object({
  index: Joi.number()
    .integer()
    .min(0)
    .required(),
  status: Joi.string()
    .valid(PLACED)
    .required(),
  x: Joi.number()
    .integer()
    .required(),
  y: Joi.number()
    .integer()
    .required(),
  blocks: Joi.array()
    .items(Joi.array().items(Joi.number().valid(EMPTY, FILLED)))
    .required(),
});

export { pieceSchema };
