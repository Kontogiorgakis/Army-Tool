import { Document, Schema, Model, model } from 'mongoose';
import { DefaultSchemaOptions } from '../../../models/shared';


// ------------------------------------------
// Interface declaration
export interface IToday extends Document {
  date: string,
  fname: string,
  lname: string,
  service: string,
  numberOf: number,
}

// ------------------------------------------
// Schema definition
const firstSchema = new Schema(
  {
    date: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    service: {type: String, required: true},
    numberOf: {type: Number, required: true}
  },
  { ...DefaultSchemaOptions }
);

// ------------------------------------------
// Schema model exports
export const TodayModel: Model<IToday> = model<IToday>(
  'Today', firstSchema, 'Today'
);
