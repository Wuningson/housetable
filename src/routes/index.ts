import { Express } from 'express';
import appointmentRoute from './appointment.route';
import patientRoute from './patient.route';

export default (app: Express) => {
  app.use('/api', appointmentRoute);
  app.use('/api', patientRoute);
};
