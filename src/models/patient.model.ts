import { Document, model, Schema } from 'mongoose';

export interface PatientDocument extends Document, Patient {
  createdAt: Date;
  updatedAt?: Date;
}

// ts-ignore
const PatientSchema = new Schema<PatientDocument>({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cat', 'dog', 'bird'],
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerAddress: {
    type: String,
    required: true
  },
  ownerPhoneNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date
  }
});

PatientSchema.pre<PatientDocument>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default model<PatientDocument>('patient', PatientSchema);
