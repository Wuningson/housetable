import { Document, Schema, Types, model } from 'mongoose';

export interface AppointmentDocument extends Document, Appointment {
  createdAt: Date;
  updatedAt?: Date;
}

const AppointmentSchema = new Schema<AppointmentDocument>({
  patient: {
    type: Types.ObjectId,
    required: true,
    ref: 'patient'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  feePaidBy: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'BTC', 'UNPAID']
  },
  amount: {
    type: Number,
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

AppointmentSchema.pre<AppointmentDocument>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default model('appointment', AppointmentSchema);
