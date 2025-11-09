import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const upsertBattingSchema = Joi.object({
  match_id: Joi.number().integer().required(),
  player_id: Joi.number().integer().required(),
  runs: Joi.number().integer().min(0).required(),
  balls: Joi.number().integer().min(0).required(),
  fours: Joi.number().integer().min(0).default(0),
  sixes: Joi.number().integer().min(0).default(0),
  dismissal: Joi.string().allow(null, ''),
  batting_position: Joi.number().integer().min(1).max(11)
});
