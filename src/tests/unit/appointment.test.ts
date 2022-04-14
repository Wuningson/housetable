import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types, connect } from 'mongoose';
import patientModel from '../../models/patient.model';
import appointmentModel from '../../models/appointment.model';
import {
  createPatient,
  deletePatientById,
  fetchPatients,
  updatePatientById
} from '../../services/patient.service';
import { generateAppointment, generatePatient } from '../testData';
import { addAppointment } from '../../services/appointment.service';

describe('Appointment Service', () => {
  let mongod: MongoMemoryServer;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connect(mongod.getUri(), { dbName: 'test' });
  });

  afterEach(async () => {
    await patientModel.deleteMany({});
    await appointmentModel.deleteMany({});
  });

  afterAll(async () => {
    await mongod.stop();
  });

  describe('addAppointment', () => {
    it('should return an appointment if the data is valid', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = generateAppointment(patient._id, startTime, endTime);
      const resp = await addAppointment(appointment);
      expect(resp.toObject()).toEqual(
        expect.objectContaining({
          ...appointment,
          startTime: new Date(startTime),
          endTime: new Date(endTime)
        })
      );
    });
  });
});
