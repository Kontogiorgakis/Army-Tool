import { Document, Schema, Model, model } from 'mongoose';
import { DefaultSchemaOptions } from '../../../models/shared';


// ------------------------------------------
// Interface declaration
export interface IFirst extends Document {
  fname: string,
  lname: string,
  eso: string,
  availability: string,
  company: string,
  armed: string,
  note: string,
  previousService: string
}

// ------------------------------------------
// Schema definition
const firstSchema = new Schema(
  {
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    eso: {type: String, required: true},
    availability: {type: String, required: true},
    company: {type: String, required: true},
    armed: {type: String, required: true},
    note: {type: String, required: true},
    previousService: {type: String, required: true}
  },
  { ...DefaultSchemaOptions }
);

// ------------------------------------------
// Schema model exports
export const FirstModel: Model<IFirst> = model<IFirst>(
  'First', firstSchema, 'First'
);
