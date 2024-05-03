import { Document, Schema, Model, model } from 'mongoose';
import { DefaultSchemaOptions } from '../../../models/shared';


// ------------------------------------------
// Interface declaration
export interface IIpiresies extends Document {
  serviceName: string,
  numOfSoldiers: number,
  untilNow: number
}

// ------------------------------------------
// Schema definition
const firstSchema = new Schema(
  {
    serviceName: {type: String, required: true},
    numOfSoldiers: {type: Number, required: true},
    untilNow: {type: Number, required: true}
  },
  { ...DefaultSchemaOptions }
);

// ------------------------------------------
// Schema model exports
export const IpiresiesModel: Model<IIpiresies> = model<IIpiresies>(
  'Ipiresies', firstSchema, 'Ipiresies'
);
